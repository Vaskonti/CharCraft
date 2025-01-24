<?php

namespace Backend\Requests;
use Backend\Database\Database;

class Request
{
    protected array $data;
    protected array $errors = [];
    protected \PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::connect();
        if (!$this->authorize()) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode(["error" => "Forbidden"]);
            exit;
        }

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
        return [
            "required" => ":field is required.",
            "string" => ":field must be a string.",
            "email" => ":field must be a valid email address.",
            "min" => ":field must be at least :min characters.",
            "max" => ":field must not exceed :max characters.",
            "confirmed" => ":field must match :field_confirmation."
        ];
    }

    public function validate(): bool
    {
        $rules = $this->rules();
        $data = $this->data;

        foreach ($rules as $field => $ruleSet) {
            foreach ($ruleSet as $rule) {
                if ($rule === 'required') {
                    if (!isset($data[$field]) || trim($data[$field]) === '') {
                        $this->addError($field, $messages["required"] ?? "$field is required.");
                    }
                }

                if ($rule === 'string') {
                    if (isset($data[$field]) && !is_string($data[$field])) {
                        $this->addError($field, $messages["string"] ?? "$field must be as string.");
                    }
                }

                if ($rule === 'email') {
                    if (isset($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
                        $this->addError($field, $messages["email"] ?? "$field must be a valid email address.");
                    }
                }

                if (str_starts_with($rule, 'min:')) {
                    $minLength = (int)substr($rule, 4);
                    if (isset($data[$field]) && strlen($data[$field]) < $minLength) {
                        $this->addError($field, str_replace([':field', ':min'], [$field, $minLength], $messages["min"] ?? "$field must be at least $minLength characters."));
                    }
                }

                if (str_starts_with($rule, 'max:')) {
                    $maxLength = (int)substr($rule, 4);
                    if (isset($data[$field]) && strlen($data[$field]) > $maxLength) {
                        $this->addError($field, str_replace([':field', ':max'], [$field, $maxLength], $messages["max"] ?? "$field must not exceed $maxLength characters."));
                    }
                }

                if ($rule === 'confirmed') {
                    if (!isset($data["{$field}_confirmation"]) || $data["{$field}_confirmation"] !== $data[$field]) {
                        $this->addError($field, str_replace(':field', $field, $messages["confirmed"] ?? "$field must match {$field}_confirmation."));
                    }
                }
                if (str_starts_with($rule, 'unique:')) {
                    [$table, $column] = explode(',', substr($rule, 7));
                    if ($this->valueExists($table, $column, $data[$field] ?? '')) {
                        $this->addError($field, str_replace(':field', $field, $messages["unique"] ?? "$field is already taken."));
                    }
                }
            }
        }
        if (!empty($this->errors)) {
            http_response_code(422);
            header('Content-Type: application/json');
            echo json_encode(["errors" => $this->errors]);
            exit;
        }

        return true;
    }

    protected function addError(string $field, string $message): void
    {
        $this->errors[$field][] = $message;
    }

    public function errors(): array
    {
        return $this->errors;
    }

    protected function valueExists(string $table, string $column, string $value): bool
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM $table WHERE $column = :value");
        $stmt->execute(['value' => $value]);
        return $stmt->fetchColumn() > 0;
    }

    public function validated(): array
    {
        return array_filter($this->data, function ($key) {
            return isset($this->rules()[$key]);
        }, ARRAY_FILTER_USE_KEY);
    }
}
