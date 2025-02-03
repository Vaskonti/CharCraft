<?php

namespace Backend\Requests;

use Backend\Constants\HttpMethods;
use Backend\Constants\ImageType;
use Backend\Database\Database;

class Request
{
    protected array $data;
    protected array $errors = [];
    protected \PDO $pdo;
    protected $authUser;

    public function __construct()
    {
        header('Content-Type: application/json');
        $this->pdo = Database::connect();
        if (!$this->authorize()) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized access."]);
            exit;
        }
        if ($_SERVER['REQUEST_METHOD'] === HttpMethods::GET) {
            $this->data = $_GET;
            return;
        }

        $this->data = $_SERVER['REQUEST_METHOD'] === HttpMethods::POST
            ? json_decode(file_get_contents("php://input"), true) ?? $_POST
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
            "confirmed" => ":field must match :field_confirmation.",
            "unique" => ":field is already taken.",
            "exists" => ":field does not exist.",
            "image" => ":field must be an image.",
            "maxSize" => "The :field must not exceed :maxSize MB.",
            "mimes" => "The :field must be of type: :mimes"
        ];
    }

    public function validate(): bool
    {
        $rules = $this->rules();
        $data = $this->data;

        foreach ($rules as $field => $ruleSet) {
            $ruleSet = is_array($ruleSet) ? $ruleSet : explode('|', $ruleSet);
            foreach ($ruleSet as $rule) {
                if ($rule === 'required') {
                    if (!isset($data[$field]) && !isset($_FILES[$field])) {
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
                if (str_starts_with($rule, 'exists:')) {
                    [$table, $column] = explode(',', substr($rule, 7));
                    if (!$this->valueExists($table, $column, $data[$field] ?? '')) {
                        $this->addError($field, str_replace(':field', $field, $messages["exists"] ?? "$field does not exist."));
                    }
                }
                if ($rule === 'file' && !isset($_FILES[$field])) {
                    $this->addError($field, "$field is required.");
                }
                if ($rule === 'image' && isset($_FILES[$field])) {
                    $mime = mime_content_type($_FILES[$field]['tmp_name']);
                    if (!in_array($mime, ImageType::ALLOWED_IMAGE_TYPES)) {
                        $this->addError($field, "$field must be an image.");
                    }
                }
                if (str_starts_with($rule, 'maxSize:') && isset($_FILES[$field])) {
                    $maxSize = (int)substr($rule, 8) * 1024 * 1024;
                    if ($_FILES[$field]['size'] > $maxSize) {
                        $this->addError($field, "The $field must not exceed " . ($maxSize / 1024 / 1024) . "MB.");
                    }
                }
                if (str_starts_with($rule, 'mimes:') && isset($_FILES[$field])) {
                    $allowedTypes = explode(',', substr($rule, 6));
                    $fileMimeType = mime_content_type($_FILES[$field]['tmp_name']);
                    if (!in_array($fileMimeType, $allowedTypes)) {
                        $this->addError($field, "The $field must be of type: " . implode(', ', $allowedTypes));

                        if (str_starts_with($rule, 'in:')) {
                            $allowedValues = explode(',', substr($rule, 3));
                            if (isset($data[$field]) && !in_array($data[$field], $allowedValues)) {
                                $this->addError($field, str_replace(':field', $field, $this->messages()["in"] ?? "$field must be one of: " . implode(', ', $allowedValues)));
                            }
                        }
                    }
                }
                if (!empty($this->errors)) {
                    http_response_code(422);
                    echo json_encode(["errors" => $this->errors]);
                    exit;
                }
            }
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
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE {$column} = :value");
        $stmt->execute(['value' => $value]);
        return $stmt->fetchColumn() > 0;
    }

    public function validated(): array
    {
        return array_filter($this->data, function ($key) {
            return isset($this->rules()[$key]);
        }, ARRAY_FILTER_USE_KEY);
    }

    public function file(string $field): ?array
    {
        if (!isset($_FILES[$field])) {
            return null;
        }
        return $_FILES[$field];
    }

    private function hasCookie(string $name): bool
    {
        return isset($_COOKIE[$name]);
    }

    public function getCookie(string $name): ?string
    {
        return $_COOKIE[$name] ?? null;
    }

    public function getAuthUser()
    {
        return $this->authUser;
    }

    public function setAuthUser($user): void
    {
        $this->authUser = $user;
    }
}
