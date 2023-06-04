; 2. Написати програму, яка буде мати наступний функціонал:
;     - Можливість введення користувачем розміру двомірного масиву.
;	  - Можливість введення користувачем значень елементів двомірного масиву.
;	  - Можливість пошуку координат всіх входжень заданого елемента в двомірному масиві, 
;       елементи масиву та пошуковий елемент вводить користувач.

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
	mtx_m				dw 0
	mtx_n				dw 0
	mtx					dw 64 dup (64 dup (?))
	search_elem			dw 0
	found_counter		db 0
	
    ; messages
	prompt_size			db 'Matrix sizes MxN (1-64):', 13, 10, '$'
	prompt_size_m		db 'm = $'
	prompt_size_n		db 'n = $'
	
	prompt_elems_1		db 'Enter $'
	prompt_elems_2		db ' matrix elements (-32768 - 32767):', 13, 10, '$'
	get_elem_mid		db '][$'
	get_elem_closing	db ']: $'
	prompt_find_elem	db 'Enter an element to find: $'
	found_elem_msg_1	db 'Element $'
	found_elem_msg_2	db ' found at position(s): $'
	not_found_msg		db 'not found.$'
	
	overflow_msg		db 'Error: Number is out of range. Try again.', 13, 10, '$'
dseg ends

cseg segment para public "code"
assume cs:cseg, ds:dseg, ss:stseg

main proc far
	mov		ax, dseg
	mov		ds, ax

	; get m and n matrix sizes
	call	get_mtx_sizes
	
	; populate matrix	
	call	populate_mtx
	
	; find all occurrences of an element
	call	search_mtx_elem
	
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
	push	bx
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
	pop		bx
	pop		cx
	pop		si
	ret
str2i16 endp

; Get matrix sizes m and n
get_mtx_sizes proc
	lea		dx, prompt_size
	mov		ah, 09h
	int		21h

get_m:
	lea		dx, prompt_size_m
	mov		ah, 09h
	int		21h
	call	input_str
	call	str2i16
	
	cmp		s2i_err, 1
	je		get_m
	cmp		number, 1
	jl		get_m
	cmp		number, 64
	jg		get_m
	
	mov		ax, number
	mov		mtx_m, ax

get_n:
	lea		dx, prompt_size_n
	mov		ah, 09h
	int		21h
	call	input_str
	call	str2i16
	
	cmp		s2i_err, 1
	je		get_n
	cmp		number, 1
	jl		get_n
	cmp		number, 64
	jg		get_n
	
	mov		ax, number
	mov		mtx_n, ax

	ret
get_mtx_sizes endp

; Populate array from the user input
populate_mtx proc
	lea		dx, prompt_elems_1
	mov		ah, 09h
	int		21h
	
	mov		ax, mtx_m
	mul		mtx_n
	call	print_i16
	
	lea		dx, prompt_elems_2
	mov		ah, 09h
	int		21h
	
	; pointers
	mov		bx, 0
	mov		si, 0
	; counters
	mov		cx, 0	; ch = i, cl = j

next_row:
	jmp		next_col
	
get_element_err:
	lea		dx, overflow_msg
	mov		ah, 09h
	int		21h
	
	next_col:
		; print '[i][j]: '
		mov		al, '['
		int		29h
		
		xor		ax, ax
		mov		al, ch
		inc		al
		call	print_i16				; 'i'
		
		lea		dx, get_elem_mid		; ']['
		mov		ah, 09h
		int		21h
		
		xor		ax, ax
		mov		al, cl
		inc		al
		call	print_i16				; 'j'
		
		lea		dx, get_elem_closing	; ']: '
		mov		ah, 09h
		int		21h
		
		; get actual element
		call	input_str
		call	str2i16	; -> number
		
		cmp		s2i_err, 1
		je		get_element_err
		
		; push element into mtx[i][j]
		mov		ax, number
		mov		mtx[bx][si], ax
		
		; continue while n size not reached
		add		si, 2
		inc		cl
		cmp		cl, byte ptr [mtx_n]
		jne		next_col
	
	; continue while m size not reached
	xor		cl, cl
	add		bx, 2
	inc		ch
	cmp		ch, byte ptr [mtx_m]
	jne		next_row

	ret
populate_mtx endp

; Search all occurrences of an element in the matrix
search_mtx_elem proc
	jmp		search_prompt
	
search_promp_err:
	lea		dx, overflow_msg
	mov		ah, 09h
	int		21h

search_prompt:
	; get element to search
	lea		dx, prompt_find_elem
	mov		ah, 09h
	int		21h
	call	input_str
	call	str2i16
	
	cmp		s2i_err, 1
	je		search_promp_err
	
	mov		ax, number
	mov		search_elem, ax
	
	; print 'Element %d found at position(s): '
	lea		dx, found_elem_msg_1
	mov		ah, 09h
	int		21h
	
	mov		ax, search_elem
	call	print_i16
	
	lea		dx, found_elem_msg_2
	mov		ah, 09h
	int		21h
	
	; pointers
	mov		bx, 0
	mov		si, 0
	; counters
	mov		cx, 0	; ch = i, cl = j

search_next_row:
	jmp		search_next_col
		
	search_next_col:
		; compare with currect
		mov		ax, search_elem
		cmp		mtx[bx][si], ax
		jne		continue_next_col
		
		; print '(i,j)'
		mov		al, '('
		int		29h
		
		xor		ax, ax
		mov		al, ch
		inc		al
		call	print_i16
		
		mov		al, ','
		int		29h
		
		xor		ax, ax
		mov		al, cl
		inc		al
		call	print_i16
		
		mov		al, ')'
		int		29h
		mov		al, ' '
		int		29h
		
		inc		found_counter
	
	continue_next_col:
		; continue until n size reached
		add		si, 2
		inc		cl
		cmp		cl, byte ptr [mtx_n]
		jne		search_next_col
	
	; continue until m size reached
	xor		cl, cl
	add		bx, 2
	inc		ch
	cmp		ch, byte ptr [mtx_m]
	jne		search_next_row
	
	cmp		found_counter, 0
	jne		finish_search
	
	lea		dx, not_found_msg
	mov		ah, 09h
	int		21h

finish_search:
	ret
search_mtx_elem endp

; Print 16-bit integer, stored in AX
print_i16 proc
	push	bx
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
	pop		bx
	ret
print_i16 endp

cseg ends
end	main