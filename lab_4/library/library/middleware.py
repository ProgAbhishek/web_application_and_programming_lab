import logging
import time

logger = logging.getLogger(__name__)

# ── Concept: Logging Middleware ──────────────────────────────
class RequestLogMiddleware:
    """Logs every request: method, path, status, response time."""

    def __init__(self, get_response):
        self.get_response = get_response  # one-time setup

    def __call__(self, request):
        start = time.time()

        # Code BEFORE view runs
        logger.info(f"→ {request.method} {request.path} | user={request.user}")

        response = self.get_response(request)  # call the view

        # Code AFTER view runs
        duration = (time.time() - start) * 1000
        logger.info(f"← {response.status_code} | {duration:.1f}ms")

        return response


# ── Concept: Security Middleware ─────────────────────────────
BANNED_IPS = ['192.168.1.100']  # demo list

class BlockBannedIPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = request.META.get('REMOTE_ADDR')
        if ip in BANNED_IPS:
            from django.http import HttpResponseForbidden
            return HttpResponseForbidden("Access denied.")
        return self.get_response(request)


# ── Concept: Error Handling Middleware ───────────────────────
class GlobalErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        logger.error(f"Unhandled exception: {exception}", exc_info=True)
        return None  # Let Django's default handler take over