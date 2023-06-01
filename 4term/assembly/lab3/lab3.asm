; Написати програму, яка повинна мати наступний функціонал:
;	- Можливість введення користувачем значень x, y, t, a, b за необхідності.
;	- Обчислювати значення функції за введеними значеннями.
;	- Виводити на екран результат обчислень.
;	- Якщо є ділення, то результат дозволяється виводити:
;		1. як дійсне число;
;		2. окремо цілу частину та остачу; 
;		3. окремо цілу частину та остачу як дріб.

stseg segment para stack "stack"
	db	64 dup (0)
stseg ends

dseg segment para public "data"
	; used in str2i16 procedure
	buf					db 7, ?, 7 dup ('?'), 0
	digit				dw 0
	number				dw 0
	is_neg				db 0
	s2i_err				db 0
	
	; operational
	x_value				dw 0
	z_value				dw 0
	denominator			dw 0
	reminder			dw 0
	
	; used in output_result
	precision			db 6
	frac_counter		db 0
	
	prompt				db 'Enter X value between -20 and 385:', 13, 10, 'X = $'
	result_msg			db 'Result: Z = $'
	overflow_msg		db 'Error: Number is out of 16-bit range.$'
	overflow_calc_msg	db 'Error: An overflow occured while calculating Z value.', 13, 10, 'Hint: Try to enter a number within the defined range.$'
dseg ends

cseg segment para public "code"
assume cs:cseg, ds:dseg, ss:stseg

main proc far
	mov		ax, dseg
	mov		ds, ax

	; get X value
	lea		dx, prompt
	call	input_str
	call	str2i16
	
	cmp		s2i_err, 1
	je		terminate
	
	mov		ax, number
	mov		x_value, ax
	
	; calculate conditionally
	call	calculate_z
	
	cmp		s2i_err, 1
	je		terminate
	
	; output
	call	output_result
	
terminate:
	mov		ah, 4Ch
	int		21h
	ret
main endp

; Get a sting from the user
input_str proc
	; display prompt, saved in dx
	mov		ah, 9
	int		21h
	
	; write input to buf
	lea		dx, buf
	mov		ah, 10
	int		21h
	
	; print new line after input
	mov		al, 10
	int		29h
	mov		al, 13
	int		29h
	
	ret
input_str endp

; Convert string to 16-bit integer
str2i16 proc
	mov		number, 0
	mov		is_neg, 0
	mov		s2i_err, 0

	mov		si, offset buf + 2
	mov		cx, 0	; string length counter
	mov		bx, 10	; multiplier

convert_loop:
	mov		ax, 0

	; finish if all digits are processed
	mov		al, buf + 1
	cmp		al, cl
	je		s2i_finish
	
	mov		al, [si]
	
	cmp		al, '0'
	jl		handle_minus
	cmp		al, '9'
	jg		s2i_error
	
	inc		si
	inc		cx
	
	jmp		to_digit

handle_minus:
	; invalid first character
	cmp		al, '-'
	jne		s2i_error
	
	cmp		cx, 0
	jne		s2i_error
	
	mov		is_neg, 1
	
	inc		si
	inc		cx
	
	jmp		convert_loop

to_digit:
	sub		al, '0'
	mov		digit, ax
	
	mov		ax, number
	mul		bx
	jo		s2i_error
	
	mov		number, ax
	mov		ax, digit
	
	cmp		number, 32760
	jne		try_add_digit
	
	cmp		ax, 8
	je		try_include_min_16bit

try_add_digit:
	add		number, ax
	js		s2i_error
	jmp		convert_loop

try_include_min_16bit:
	cmp		is_neg, 0
	je		try_add_digit
	
	neg		number
	sub		number, ax
	jo		s2i_error
	
	jmp		s2i_ret

s2i_error:
	lea		dx, overflow_msg
	mov		ah, 9
	int		21h
	
	mov		s2i_err, 1
	jmp		s2i_ret

s2i_finish:
	cmp		is_neg, 1
	jne		s2i_ret
	neg		number

s2i_ret:
	ret
str2i16 endp

; Calculate Z value based on provided X value
calculate_z proc
	mov		ax, x_value
	cmp		ax, 1
	jle		z2
	
	cmp		ax, 20
	jg		z3
	
	jmp		z1

; z = 54 + x^2 / (1 + x)
; Domain: 1 < x <= 20
; No overflow: any
z1:
	mov		bx, ax
	
	mul		ax			; ax = x^2
	
	inc		bx			; bx = 1 + x
	mov		denominator, bx
	div		bx
	mov		reminder, dx
	
	add		ax, 54
	mov		z_value, ax
	
	jmp		finish_calc

; z = 75 * x^2 - 17 * x
; Domain: x <= 1
; No overflow: [-20; 1]
z2:
	imul	ax			; ax = x^2
	jo		error_calc
	
	mov		bx, 75
	mul		bx			; bx = 75 * x^2
	js		error_calc
	mov		bx, ax
	
	mov		ax, x_value
	mov		cx, 17
	imul	cx			; ax = 17 * x
	jo		error_calc
	
	sub		bx, ax
	mov		z_value, bx
	
	jmp		finish_calc

; z = 85 * x / (1 + x)
; Domain: x > 20
; No overflow: (20; 385]
z3:
	mov		bx, ax
	
	mov		cx, 85
	mul     cx			; ax = 85 * x
	js		error_calc
	
	inc		bx			; bx = 1 + x
	mov		denominator, bx
	div		bx
	mov		z_value, ax
	mov		reminder, dx
	
	jmp		finish_calc

error_calc:
	lea		dx, overflow_calc_msg
	mov		ah, 9
	int		21h
	
	mov		s2i_err, 1
	
	jmp		finish_calc

finish_calc:
	ret

calculate_z endp

; Output calculated Z value with float support
output_result proc
	lea		dx, result_msg
	mov		ah, 9
	int		21h
	
	; print whole part
	mov		ax, z_value
	call 	print_i16
	
	cmp		reminder, 0
	je		finish_output
	
	; print fractional part with precision
	mov		al, '.'
	int		29h

frac_loop:
	mov		bx, 10
	mov		ax, reminder
	
	mul		bx				; ax = r * 10
	div		denominator		; ax = r * 10 / d
	mov		reminder, dx
	
	call	print_i16
	
	; stop when reminder is zero
	cmp		reminder, 0
	je		finish_output
	
	inc		frac_counter
	
	; stop when precision is reached
	mov		al, frac_counter
	cmp		al, precision
	je		finish_output
	
	jmp		frac_loop

finish_output:
	ret
output_result endp

; Print 16-bit integer, stored in AX
print_i16 proc
	push	cx
	
	mov		bx, ax
	or		bx, bx
	jns		i16_m1

	mov		al, '-'
	int		29h
	
	neg		bx

i16_m1:
	mov		ax, bx
	xor		cx, cx
	mov		bx, 10

i16_m2:
	xor		dx, dx
	
	div		bx
	add		dl, '0'
	
	push	dx
	inc		cx
	
	test	ax, ax
	jnz		i16_m2

i16_m3:
	pop		ax
	int		29h
	loop	i16_m3
	
	pop		cx
	ret
print_i16 endp

cseg ends
end	main