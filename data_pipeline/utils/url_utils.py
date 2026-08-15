from urllib.parse import (
    parse_qsl,
    urlencode,
    urlsplit,
    urlunsplit,
)


TRACKING_PARAMETERS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
}

def canonicalize_url(url: str) -> str:
    url = url.strip()
    parsed = urlsplit(url)
    scheme = parsed.scheme.lower()

    hostname = (
        parsed.hostname.lower()
        if parsed.hostname
        else ""
    )
    netloc = hostname

    if parsed.port:
        if not ((scheme == "http" and parsed.port == 80) or (scheme == "https" and parsed.port == 443)):
            netloc = f"{hostname}:{parsed.port}"

    query_params = parse_qsl(
        parsed.query,
        keep_blank_values=True,
    )

    filtered_params = [
        (key, value)
        for key, value in query_params
        if key.lower() not in TRACKING_PARAMETERS
    ]

    query = urlencode(
        filtered_params,
        doseq=True,
    )

    path = parsed.path or "/"

    if path != "/":
        path = path.rstrip("/")

    return urlunsplit(
        (
            scheme,
            netloc,
            path,
            query,
            "",
        )
    )