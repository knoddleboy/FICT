; Написати програму з використанням 2-х процедур:
;	- Процедура введення і перетворення цілого числа. 
;	  Після цього треба виконати математичну дію над числом (номер завдання вибирати 
;	  за останніми двома числами номеру в заліковій книжці - Таблиця 2.1).
;	- Процедура переведення отриманого результату в рядок та виведення його на екран.
; Програма повинна мати захист від некоректного введення вхідних даних (символи, 
; переповнення, ділення на 0 і т.і.)

stseg segment para stack "stack"
	db	64 dup (0)
stseg ends

dseg segment para public "data"
	; used in str2i16 procedure
	buf				db 7, ?, 7 dup ('?'), 0
	digit			dw 0
	number			dw 0
	is_neg			db 0
	s2i_err			db 0
	
	; operational
	result			dw 0
	
	prompt			db 'Enter a number (-32680 - 32767): $'
	overflow_msg	db 'Error: Number is out of range. $'
	result1_msg		db 'Result: $'
	result2_msg		db ' - 88 = $'
dseg ends

cseg segment para public "code"
assume cs:cseg, ds:dseg, ss:stseg

main proc far
	mov		ax, dseg
	mov		ds, ax

	; get string number from user
	call	input_number
	
	; transform string to integer
	call	str2i16
	
	cmp		s2i_err, 1
	je		terminate
	
	; subtract 88 and save to result
	mov		ax, number
	mov		result, ax
	sub		result, 88
	
	; output the result to the console
	lea		dx, result1_msg
    mov		ah, 9
    int		21h

	mov		ax, number
	call	print_int
	
	lea		dx, result2_msg
    mov		ah, 9
    int		21h

	mov		ax, result
	call	print_int
	
terminate:
	mov		ah, 4Ch
	int		21h
	ret
main endp

; Get an input number from the user
input_number proc
	; display prompt
	lea		dx, prompt
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
input_number endp

; Convert string to 16-bit integer
str2i16	proc
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
	add		number, ax
	js		s2i_error
	
	jmp		convert_loop

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
	cmp		number, -32680
	jl		s2i_error

s2i_ret:
	ret
str2i16	endp

; Print an integer, stored in AX
print_int proc
	mov		bx, ax
	or		bx, bx
	jns		m1

	mov		al, '-'
	int		29h
	
	neg		bx

m1:
	mov		ax, bx
	xor		cx, cx
	mov		bx, 10

m2:
	xor		dx, dx
	
	div		bx
	add		dl, '0'
	
	push	dx
	inc		cx
	
	test	ax, ax
	jnz		m2

m3:
	pop		ax
	int		29h
	loop	m3

	ret
print_int endp

cseg ends
end	main