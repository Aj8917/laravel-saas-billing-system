<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class companyDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //allow the request to proceed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */


     protected function prepareForValidation()
    {
        try {
            $this->merge([
                'tenant_id' => decrypt($this->tenant_id),
            ]);
        } catch (\Exception $e) {
            // Let the validation fail later if decryption doesn't work
            $this->merge([
                'tenant_id' => null,
            ]);
        }
    }
    public function rules(): array
    {
        return [
            'tenant_id' => 'required|exists:tenants,id',
            'address' => 'required|string|max:255',
            'businessType' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'gstin' => [
                
                'string',
                'max:15',
                'unique:company_details,gstin',
                'regex:/^[A-Za-z0-9]+$/', // Alphanumeric only
            ],
            'industry' => 'required|string|max:255',
            'pan' => [
                
                'string',
                'max:10',
                'unique:company_details,pan',
                'regex:/^[A-Za-z0-9]+$/', // Alphanumeric only
            ],
            'pincode' => 'required|string|max:10',
            'state' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'gstin.regex' => 'The GSTIN must not contain special characters.',
            'pan.regex' => 'The PAN must not contain special characters.',
        ];
    }
}
