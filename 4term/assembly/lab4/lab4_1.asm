; 1. Написати програму, яка повинна мати наступний функціонал:
;       - Можливість введення користувачем розміру одномірного масиву.
;	    - Можливість введення користувачем значень елементів одномірного масиву.
;	    - Можливість знаходження суми елементів одномірного масиву.
;	    - Можливість пошуку максимального (або мінімального) елемента одномірного масиву.
;	    - Можливість сортування одномірного масиву цілих чисел загального вигляду.

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
	arr_size			dw 0
	arr					dw 64 dup (?)
	arr_min				dw 0
	arr_max				dw 0
	
    ; messages
	prompt_size			db 'Array size (1-64): $'
	prompt_elems_1		db 'Enter $'
	prompt_elems_2		db ' array elements (-32768 - 32767):', 13, 10, '$'
	get_elem_closing	db ']: $'
	orig_arr_msg		db 'Original array:', 13, 10, '$'
	sorted_arr_msg		db 13, 10, 'Sorted array (asc):', 13, 10, '$'
	arr_sum_msg			db 13, 10, 'Sum: $'
	arr_min_msg			db 13, 10, 'Min: $'
	arr_max_msg			db 13, 10, 'Max: $'
	
	overflow_msg		db 'Error: Number is out of range. Try again.', 13, 10, '$'
dseg ends

cseg segment para public "code"
assume cs:cseg, ds:dseg, ss:stseg

main proc far
	mov		ax, dseg
	mov		ds, ax

get_arr_size:
	; get array size
	lea		dx, prompt_size
	mov		ah, 09h
	int		21h
	call	input_str
	call	str2i16
	
	cmp		s2i_err, 1
	je		get_arr_size
	cmp		number, 1
	jl		get_arr_size
	cmp		number, 64
	jg		get_arr_size
	
	mov		ax, number
	mov		arr_size, ax
	
	; populate array	
	call	populate_array
	
	; print original array
	lea		dx, orig_arr_msg
	mov		ah, 09h
	int		21h
	call	print_arr
	
	; calculate and print array sum
	call	array_sum
	
	; find min and max elements
	call	arr_min_max
	
	; sort array
	call	sort_array
	
	; print sorted array
	lea		dx, sorted_arr_msg
	mov		ah, 09h
	int		21h
	call	print_arr
	
terminate:
	mov		ah, 4Ch
	int		21h
	ret
main endp

; Get a sting from the user
input_str proc
	; get input and write to buf
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
	push	cx
	push	si
	
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
	mov		s2i_err, 1
	jmp		s2i_ret

s2i_finish:
	cmp		is_neg, 1
	jne		s2i_ret
	neg		number

s2i_ret:
	pop		cx
	pop		si
	ret
str2i16 endp

; Populate array from the user input
populate_array proc
	lea		dx, prompt_elems_1
	mov		ah, 09h
	int		21h
	
	mov		ax, arr_size
	call	print_i16
	
	lea		dx, prompt_elems_2
	mov		ah, 09h
	int		21h
	
	mov		si, 0
	mov		cx, 0	; i
	jmp		get_element

get_element_err:
	lea		dx, overflow_msg
	mov		ah, 09h
	int		21h

get_element:
	; print '[i+1]: '
	mov		al, '['
	int		29h
	
	mov		ax, cx
	inc		ax
	call	print_i16
	
	lea		dx, get_elem_closing
	mov		ah, 09h
	int		21h
	
	; get actual element
	call	input_str
	call	str2i16	; -> number
	
	cmp		s2i_err, 1
	je		get_element_err
	
	; push element into arr
	mov		bx, si
	shl		bx, 1
	mov		ax, number
	mov		[arr + bx], ax
	inc		si
	
	; continue until arr size reached
	inc		cx
	cmp		cx, arr_size
	jne		get_element

	ret
populate_array endp

; Sort an array in ascending order using bubble sort
sort_array proc
    mov		cx, 0	; i

outer_loop:
	mov		si, 0	; j

	inner_loop:
		mov		bx, si
		shl		bx, 1
		
		mov		ax, [arr + bx]
		cmp		ax, [arr + bx + 2]
		jng		next_iter			; skip swap if arr[j] <= arr[j+1]
		
		; swap arr[j] and arr[j+1]
		mov		dx, [arr + bx + 2]
		mov		[arr + bx + 2], ax
		mov		[arr + bx], dx

	next_iter:
		add		si, 1	; j++
		
		mov		ax, arr_size
		dec		ax
		sub		ax, cx	; ax = size - i - 1
		cmp		si, ax
		jl		inner_loop			; continue inner loop while j < size - i - 1

	; end of inner loop
	inc		cx		; i++
	cmp		cx, arr_size - 1
	jl		outer_loop			    ; continue outer loop while i < size - 1

end_sort:
	ret
sort_array endp

; Calculate the sum of array elements
array_sum proc
.386
	lea		dx, arr_sum_msg
	mov		ah, 09h
	int		21h
	
	lea		si, arr
	mov		cx, arr_size
	mov		dx, 0 ; sum

arr_sum_loop:
	mov		ax, [si]
	cwde
	add		edx, eax
	add		si, 2
	loop	arr_sum_loop
	
	mov		eax, edx
	call	print_i32
	
	ret
array_sum endp

; Find min and max elements in array
arr_min_max proc
	mov		ax, [arr]
	mov		arr_min, ax
	mov		arr_max, ax
	
	lea		si, arr
	mov		cx, arr_size
	dec		cx
	jz		end_min_max

find_min_max:
	add		si, 2
	
	mov     ax, [si]
    cmp     arr_max, ax
    jl      update_max
	
    cmp     arr_min, ax
    jg      update_min
	
	jmp		continue_min_max

update_min:
	mov		arr_min, ax
	jmp		continue_min_max

update_max:
	mov		arr_max, ax
	jmp		continue_min_max

continue_min_max:
	loop	find_min_max

end_min_max:
	; print min and max values
	lea		dx, arr_min_msg
	mov		ah, 09h
	int		21h
	mov		ax, arr_min
	call	print_i16
		
	lea		dx, arr_max_msg
	mov		ah, 09h
	int		21h
	mov		ax, arr_max
	call	print_i16
	
	ret
arr_min_max endp

; Print array elements
print_arr proc
	lea		si, arr
	mov		cx, arr_size

print_arr_loop:
	mov		ax, [si]
	
	; print current element
	call	print_i16
	
	; print spacer
	mov		al, ' '
	int		29h
	
	; continue until arr size reached
	add		si, 2
	loop	print_arr_loop
	
	ret
print_arr endp

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

; Print 32-bit integer, stored in EAX
print_i32 proc
.386
	push	cx
	
	mov		ebx, eax
	or		ebx, ebx
	jns		i32_m1

	mov		al, '-'
	int		29h
	
	neg		ebx

i32_m1:
	mov		eax, ebx
	xor		cx, cx
	mov		ebx, 10

i32_m2:
	xor		edx, edx
	
	div		ebx
	add		dl, '0'
	
	push	dx
	inc		cx
	
	test	eax, eax
	jnz		i32_m2

i32_m3:
	pop		ax
	int		29h
	loop	i32_m3
	
	pop		cx
	ret
print_i32 endp

cseg ends
end	main