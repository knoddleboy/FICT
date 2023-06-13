; Переписати одну програму (на вибір студента) комп‘ютерного практикуму №4 
; з використанням макросів та залученням міток в тілі макросу.

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

; Print a string
; Input:
;	s - string to print
print_str macro s
	lea		dx, s
	mov		ah, 9
	int		21h
endm

; Get a string from the user
; Input:
;	prmt - a prompt to display
input_str macro
	lea		dx, buf
	mov		ah, 10
	int		21h
	
	; print new line after input
	mov		al, 10
	int		29h
	mov		al, 13
	int		29h
endm

; Convert string to 16-bit integer
; Input:
;	in_str - string to convert
;
; Output:
;	out_n  - converted number
str2i16 macro in_str, out_n
local	convl, minus, to_digit, add_d, incl_min, err, finish, done
	push	cx
	push	si
	
	mov		out_n, 0
	mov		is_neg, 0
	mov		s2i_err, 0

	mov		si, offset in_str + 2
	mov		cx, 0	; string length counter
	mov		bx, 10	; multiplier

	convl:
		mov		ax, 0

		; finish if all digits are processed
		mov		al, in_str + 1
		cmp		al, cl
		je		finish
		
		mov		al, [si]
		
		cmp		al, '0'
		jl		minus
		cmp		al, '9'
		jg		err
		
		inc		si
		inc		cx
		
		jmp		to_digit

	minus:
		; invalid first character
		cmp		al, '-'
		jne		err
		
		cmp		cx, 0
		jne		err
		
		mov		is_neg, 1
		
		inc		si
		inc		cx
		
		jmp		convl

	to_digit:
		sub		al, '0'
		mov		digit, ax
		
		mov		ax, out_n
		mul		bx
		jo		err
		
		mov		out_n, ax
		mov		ax, digit
		
		cmp		out_n, 32760
		jne		add_d
		
		cmp		ax, 8
		je		incl_min

	add_d:
		add		out_n, ax
		js		err
		jmp		convl

	incl_min:
		cmp		is_neg, 0
		je		add_d
		
		neg		out_n
		sub		out_n, ax
		jo		err
		
		jmp		done

	err:
		print_str	overflow_msg
		
		mov		s2i_err, 1
		jmp		done

	finish:
		cmp		is_neg, 1
		jne		done
		neg		out_n

	done:
		pop		cx
		pop		si
		exitm
endm

; Print 16-bit integer
; Input:
;	val - value to print
print_i16 macro val
local	m1, m2, m3
	push	cx
	
	mov		bx, val
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
		
		pop		cx
endm

; Print 32-bit integer
; Input:
;	val - value to print
print_i32 macro val
local	m1, m2, m3
.386
	push	cx
	
	mov		ebx, val
	or		ebx, ebx
	jns		m1

	mov		al, '-'
	int		29h
	
	neg		ebx

	m1:
		mov		eax, ebx
		xor		cx, cx
		mov		ebx, 10

	m2:
		xor		edx, edx
		
		div		ebx
		add		dl, '0'
		
		push	dx
		inc		cx
		
		test	eax, eax
		jnz		m2

	m3:
		pop		ax
		int		29h
		loop	m3
		
		pop		cx
endm

main proc far
	mov		ax, dseg
	mov		ds, ax

get_arr_size:
	; get array size
	print_str	prompt_size
	input_str
	str2i16		buf, arr_size
	
	cmp		s2i_err, 1
	je		get_arr_size_err
	cmp		arr_size, 1
	jl		get_arr_size_err
	cmp		arr_size, 64
	jg		get_arr_size_err
	
	jmp		continue_main

get_arr_size_err:
	jmp get_arr_size

continue_main:
	; populate array	
	call	populate_array
	
	; print original array
	print_str	orig_arr_msg
	call	print_arr
	
	; calculate and print array sum
	call	array_sum
	
	; find min and max elements
	call	arr_min_max
	
	; sort array
	call	sort_array
	
	; print sorted array
	print_str	sorted_arr_msg
	call	print_arr
	
terminate:
	mov		ah, 4Ch
	int		21h
	ret
main endp

; Populate array from the user input
populate_array proc
	print_str	prompt_elems_1
	print_i16	arr_size
	print_str	prompt_elems_2
	
	mov		si, 0
	mov		cx, 0	; i
	jmp		get_element

get_element_err:
	print_str	overflow_msg

get_element:
	; print '[i+1]: '
	mov		al, '['
	int		29h
	
	mov		ax, cx
	inc		ax
	print_i16	ax
	
	print_str	get_elem_closing
	
	; get actual element
	input_str
	str2i16		buf, number
	
	cmp		s2i_err, 1
	je		to_get_element_err
	
	; push element into arr
	mov		bx, si
	shl		bx, 1
	mov		ax, number
	mov		[arr + bx], ax
	inc		si
	
	; continue if arr size not reached
	inc		cx
	cmp		cx, arr_size
	jne		to_get_element
	
	jmp		finish_population

to_get_element_err:
	jmp		get_element_err

to_get_element:
	jmp		get_element

finish_population:
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
	print_str	arr_sum_msg
	
	lea		si, arr
	mov		cx, arr_size
	mov		dx, 0 ; sum

arr_sum_loop:
	mov		ax, [si]
	cwde
	add		edx, eax
	add		si, 2
	loop	arr_sum_loop
	
	print_i32	edx
	
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
	print_str	arr_min_msg
	print_i16	arr_min
	
	print_str	arr_max_msg
	print_i16	arr_max
	
	ret
arr_min_max endp

; Print array elements
print_arr proc
	lea		si, arr
	mov		cx, arr_size

print_arr_loop:
	; print current element
	print_i16	[si]
	
	; print spacer
	mov		al, ' '
	int		29h
	
	; continue until arr size reached
	add		si, 2
	loop	print_arr_loop
	
	ret
print_arr endp

cseg ends
end	main