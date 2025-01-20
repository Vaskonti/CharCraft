<?php

namespace Backend\Responses;

use Backend\Responses\Response;
use SimpleXMLElement;

class XmlResponse extends Response
{
    public function __construct($data, int $statusCode = 200, array $headers = [])
    {
        $headers["Content-Type"] = "application/xml";
        parent::__construct($data, $statusCode, $headers);
    }

    protected function formatResponse(): string
    {
        $xml = new SimpleXMLElement('<response/>');
        $this->arrayToXml($this->data, $xml);
        return $xml->asXML();
    }

    private function arrayToXml($data, &$xml)
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $child = $xml->addChild($key);
                $this->arrayToXml($value, $child);
            } else {
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }
}

