<?php

function method(): string
{
    return $_SERVER['REQUEST_METHOD'];
}

function uri(): string
{
    return $_SERVER['REQUEST_URI'];
}