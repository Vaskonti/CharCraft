<?php

namespace Backend\Requests;
class Request
{
    protected array $data;
    protected array $errors = [];

    public function __construct()
    {
        $this->data = $_SERVER['REQUEST_METHOD'] === 'POST'
            ? json_decode(file_get_contents("php://input"), true) ?? []
            : $_GET;
    }

    public function rules(): array
    {
        return [];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [];
    }

    public function validate(): bool
    {
        $rules = $this->rules();
        $data = $this->data;

        foreach ($rules as $field => $ruleSet) {
            $ruleList = explode('|', $ruleSet);

            foreach ($ruleList as $rule) {
                if (str_starts_with($rule, 'max:')) {
                    $maxLength = (int)substr($rule, 4);
                    if (isset($data[$field]) && strlen($data[$field]) > $maxLength) {
                        $this->errors[$field][] = $this->messages()["max"] ?? "$field must not exceed $maxLength characters.";
                    }
                }

                if ($rule === 'confirmed') {
                    if (!isset($data["{$field}_confirmation"]) || $data["{$field}_confirmation"] !== $data[$field]) {
                        $this->errors[$field][] = $this->messages()["confirmed"] ?? "$field must match {$field}_confirmation.";
                    }
                }
            }
        }

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function validated(): array
    {
        return array_filter($this->data, function ($key) {
            return isset($this->rules()[$key]);
        }, ARRAY_FILTER_USE_KEY);
    }
}
