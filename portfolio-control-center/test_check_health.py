#!/usr/bin/env python3
"""Offline regression tests for the KARMA HTTP health probe."""
import importlib.util
import pathlib
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

SCRIPT = pathlib.Path(__file__).with_name("check_health.py")
spec = importlib.util.spec_from_file_location("karma_check_health", SCRIPT)
health = importlib.util.module_from_spec(spec)
spec.loader.exec_module(health)

TARGET = {"repo": "sample", "url": "https://example.invalid/", "expected": "Expected Title"}


class FakeResponse:
    status = 200

    def __init__(self, body):
        self.body = body

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def read(self, limit):
        return self.body[:limit]


class HealthCheckTests(unittest.TestCase):
    def test_reachable_when_expected_text_is_present(self):
        with patch.object(health.urllib.request, "urlopen", return_value=FakeResponse(b"<title>Expected Title</title>")):
            result = health.check(TARGET)
        self.assertEqual(result["status"], "reachable")
        self.assertEqual(result["http"], 200)
        self.assertTrue(result["contentVerified"])

    def test_missing_expected_text_needs_attention(self):
        with patch.object(health.urllib.request, "urlopen", return_value=FakeResponse(b"<title>Other</title>")):
            result = health.check(TARGET)
        self.assertEqual(result["status"], "attention")
        self.assertFalse(result["contentVerified"])

    def test_authentication_is_not_reported_as_outage(self):
        for code in (401, 403):
            with self.subTest(code=code):
                with patch.object(health.urllib.request, "urlopen", side_effect=HTTPError(TARGET["url"], code, "Denied", {}, None)):
                    result = health.check(TARGET)
                self.assertEqual(result["status"], "protected")
                self.assertEqual(result["http"], code)

    def test_server_error_needs_attention(self):
        with patch.object(health.urllib.request, "urlopen", side_effect=HTTPError(TARGET["url"], 500, "Error", {}, None)):
            result = health.check(TARGET)
        self.assertEqual(result["status"], "attention")
        self.assertEqual(result["http"], 500)

    def test_network_failure_needs_attention(self):
        with patch.object(health.urllib.request, "urlopen", side_effect=TimeoutError("timed out")):
            result = health.check(TARGET)
        self.assertEqual(result["status"], "attention")
        self.assertIsNone(result["http"])


if __name__ == "__main__":
    unittest.main()
