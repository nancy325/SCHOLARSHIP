<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScholarshipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization is handled by middleware and controller
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'in:government,private,university,institute'],
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
            'institute_id' => ['nullable', 'integer', 'exists:institutes,id'],
            'eligibility' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'deadline' => ['required', 'date', 'after:today'],
            'apply_link' => ['required', 'url', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The scholarship title is required.',
            'title.max' => 'The scholarship title may not be greater than 150 characters.',
            'description.required' => 'The scholarship description is required.',
            'type.required' => 'The scholarship type is required.',
            'type.in' => 'The selected scholarship type is invalid.',
            'university_id.exists' => 'The selected university does not exist.',
            'institute_id.exists' => 'The selected institute does not exist.',
            'deadline.required' => 'The application deadline is required.',
            'deadline.after' => 'The application deadline must be a future date.',
            'apply_link.required' => 'The application link is required.',
            'apply_link.url' => 'The application link must be a valid URL.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'scholarship title',
            'description' => 'description',
            'type' => 'scholarship type',
            'university_id' => 'university',
            'institute_id' => 'institute',
            'eligibility' => 'eligibility criteria',
            'start_date' => 'start date',
            'deadline' => 'application deadline',
            'apply_link' => 'application link',
        ];
    }
}

