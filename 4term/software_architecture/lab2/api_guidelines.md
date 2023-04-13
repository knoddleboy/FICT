# Conventions used in these guidelines

The requirement level keywords `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` used in this document (case insensitive) are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## API design principles

The RESTful web service principles is applied to all kind of application (micro-) service components.

-   REST-based APIs with JSON payloads is preferable

## General guidelines

### API First

Everyone **MUST** follow the API First principle.
The API first principle is an extension of contract-first principle. Therefore, a development of an API **MUST** always start with API design without any upfront coding activities.

### Contract

An update to the corresponding contract (API Design) **MUST** be implemented and approved before any change to an API **MUST**.

### Version Control System

Every API design **SHOULD** be stored in a Version Control System (GitHub). Where possible the API design **SHOULD** stored in the same repository as the API implementation.

### Rules for Extending

Any modification to an existing API **MUST** avoid breaking changes and **MUST** maintain backward compatibility.

In particular, any change to an API **MUST** follow the following Rules for Extending:

-   You **MUST NOT** take anything away
-   You **MUST NOT** change processing rules
-   You **MUST NOT** make optional things required
-   Anything you add **MUST** be optional

## Versioning changes

The versioning scheme is designed to promote incremental improvement to the API and discourage rewrites.

### Version maintenance

Maintain old API versions for at least 6 months.

### Implementation guidelines

The API version **MUST** be defined in the URL structure (e.g. `/v1`).

# REST API guidelines

## JSON API

All endpoints must follow the core [JSON API spec](http://jsonapi.org/format/)

Changes from JSON API:

-   The primary resource must be keyed by its resource type. The endpoint URL must also match the resource type.
-   API errors do not currently follow the JSON API spec.
-   Updates should always return `200 OK` with the full resource to simplify internal logic.

Example of keying the resource by type:

```json
GET /documents/1
```

```json
{
    "documents": {
        "id": 1
    }
}
```

All action calls to an endpoint must be wrapped in a `data` envelope.
This is because actions are carried out on a resource but use a different data type than the core resource itself.

Example of an action call:

```json
POST /documents/action/share

{
  "data": {
    "document_id": 1
  }
}
```

## JSON only

The API should only support JSON.

Reference: http://www.mnot.net/blog/2012/04/13/json_or_xml_just_decide

## General guidelines

-   A URL identifies a resource.
-   URLs should include nouns, not verbs.
-   For consistency, only use plural nouns (e.g. "documents" instead of "document").
-   Use HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to operate on resources.
-   API should be behind a subdomain: `api.lir-editor.com`

## HTTP verbs

Here's an example of how HTTP verbs map to create, read, update, delete operations in a particular context:

| HTTP METHOD  | POST                | GET                     | PUT                                                    | PATCH                                                             | DELETE               |
| :----------- | :------------------ | :---------------------- | :----------------------------------------------------- | :---------------------------------------------------------------- | :------------------- |
| CRUD OP      | CREATE              | READ                    | UPDATE                                                 | UPDATE                                                            | DELETE               |
| /documents   | Create new Document | List documents          | Bulk update                                            | Error                                                             | Delete all documents |
| /documents/1 | Error               | Show Document If exists | If exists, full/partial update Document; If not, error | If exists, update Document using JSON Patch format; If not, error | Delete Document      |

## Actions

Where special actions are required, place them under an `actions` prefix.
Actions should always be idempotent.

```http
POST /document/{id}/actions/delete
```

## Responses

Don’t set values in keys.

#### Good

```json
"example": [
  { "id": "123", "name": "123_name" },
  { "id": "456", "name": "456_name" }
]
```

#### Bad

```json
"example": [
  { "123": "123_name" },
  { "456": "456_name" }
]
```

## String IDs

Always return string ids. Serialize/deserialize INTs to strings when storing IDs as INTs.

## Error handling

Error responses should include a message for the user, an internal error type (corresponding to some
specific internally determined constant represented as a string), and links to info for developers.

There must only be one top level error. Errors should be returned in turn. This makes internal error
logic and dealing with errors as a consumer of the API easier.

Validation and resource errors are nested in the top level error under `errors`.

The error is nested in `error` to make it possible to add, for example, deprecation errors on successful requests.

The HTTP status `code` is used as a top level error, `type` is used as a sub error, and nested
`errors` may have more specific `type` errors, such as `invalid_field`.

### Formating errors vs integration errors

Formatting errors should be separate from errors handled by the integration.

Formatting errors include things like field presence and length, and are returned when incorrect
data is sent to the API.

An example of an error that should be handled by the integration is attempting to open a document for a non-existing user. This is an edge case that the API integration needs to handle. Do not mask these errors as validation errors. Return them as a top level error instead.

### Top level error

-   Top level errors **MUST** implement `request_id`, `type`, `code` and `message`.
-   `type` **MUST** relate to the `reason`. For example, use it to categorise the error: `reason: api_error`.
-   `message` **MUST** be specific.
-   Top level errors **MAY** implement `documentation_url`, `request_url` and `id`.
-   Only return `id` for server errors (5xx). The `id` should point to the exception you track internally.

```json
{
    "error": {
        "documentation_url": {docs_host},
        "request_url": "https://api.lir-editor.com/requests/REQUEST_ID",
        "request_id": "REQUEST_ID",
        "id": "ERROR_ID",
        "type": "access_forbidden",
        "code": 403,
        "message": "You don't have the right permissions to access this resource"
    }
}
```

### Nested errors

-   Nested errors **MUST** implement `reason` and `message`.
-   `reason` **MUST** be specific to the error.
-   Nested errors **MAY** implement `field`.

```json
{
    "error": {
        "top level errors": "...",

        "errors": [
            {
                "field": "account_id",
                "reason": "missing_field",
                "message": "Account ID is required"
            }
        ]
    }
}
```

### HTTP status code summary

-   `200 OK` - everything worked as expected.
-   `400 Bad Request` - e.g. invalid JSON.
-   `401 Unauthorized` - no valid API key provided.
-   `402 Request Failed` - parameters were valid but request failed.
-   `403 Forbidden` - missing or invalid permissions.
-   `404 Not Found` - the requested item doesn’t exist.
-   `422 Unprocessable Entity` - parameters were invalid/validation failed.
-   `500, 502, 503, 504 Server errors` - something went wrong on server's end.

#### 400 Bad Request

-   When the request body contains malformed JSON.
-   When the JSON is valid but the document structure is invalid (e.g. passing an array when an object should be passed).

#### 422 Unprocessable Entity

-   When model validations fail for fields (e.g. name too long).
-   Trying to create a resource when a related resource is in a bad state.

## X-Headers

The use of `X-Custom-Header` has [been deprecated](http://tools.ietf.org/html/rfc6648).

## Resource filtering

Resource filters **MUST** be in singular form.

Multiple IDs should be supplied to a filter as a comma separated list, and should be translated into an `OR` query. Chaining multiple filters with `&` **SHOULD** be translated into an `AND` query.

## Pagination

All list/index endpoints must be paginated by default. Pagination must be reverse chronological.

Only support cursor or time based pagination.

#### Defaults

`limit=50`
`after=NEWEST_RESOURCE`
`before=null`

#### Limits

`limit=500`

Parameters:

| Name     |  Type  |        Description |
| -------- | :----: | -----------------: |
| `after`  | string |  id to start after |
| `before` | string | id to start before |
| `limit`  | string |  number of records |

### Response

Paginated results are always enveloped:

```json
{
  "meta": {
    "cursors": {
      "after": "abcd1234",
      "before": "wxyz0987"
    },
    "limit": 50
  },
  "documents": [{
    ...
  },
  ...]
}
```

## Updates

Full or partial updates using `PUT` should replace any parameters passed and ignore fields not submitted.

```http
GET /documents/123
{
  "id": "123",
  "meta": {
    "created": "date",
    "published": false
  }
}
```

```http
PUT /documents/123 { "meta": { "published": true } }
{
  "id": "123",
  "meta": {
    "published": false
  }
}
```

### PATCH Updates

PATCH is reserved for [JSON Patch](http://jsonapi.org/format/#patch) operations.

## JSON encode POST, PUT & PATCH bodies

`POST`, `PUT` and `PATCH` expect JSON bodies in the request. `Content-Type` header MUST be set to `application/json`.
For unsupported media types a `415` (Unsupported Media Type) response code is returned.

## Caching

Most responses return an `ETag` header. Many responses also return a `Last-Modified` header. The
values of these headers can be used to make subsequent requests to those resources using the
`If-None-Match` and `If-Modified-Since` headers, respectively. If the resource has not changed, the
server will return a `304 Not Modified`. Note that making a conditional request and receiving a 304
response does _not_ count against your rate limit, so we encourage you to use it whenever possible.

`Cache-Control: private, max-age=60`\
`ETag: <hash of contents>`\
`Last-Modified: updated_at`

#### Vary header

The following header values **MUST** be declared in the Vary header: `Accept`, `Authorization` and `Cookie`.

Any of these headers can change the representation of the data and should invalidate a cached
version. This can be useful if users have different accounts to do admin, each with different
privileges and resource visibility.

Reference: https://www.mnot.net/cache_docs/

## Result filtering, sorting & searching

See JSON-API: http://jsonapi.org/format/#fetching-filtering

## Pretty printed responses

JSON responses should be pretty printed.

## Time zone/dates

Explicitly provide an ISO8601 timestamp with timezone information (DateTime in UTC).
Use the exact timestamp for API calls that allow a timestamp to be specified.
These timestamps look something like `2014-02-27T15:05:06+01:00`. ISO 8601 UTC format: YYYY-MM-DDTHH:MM:SSZ.

## HTTP rate limiting

All endpoints must be rate limited. The current rate limit status is returned in the HTTP headers of
all API requests.

```http
Rate-Limit-Limit: 5000
Rate-Limit-Remaining: 4994
Rate-Limit-Reset: Thu, 01 Dec 1994 16:00:00 GMT
Content-Type: application/json; charset=utf-8
Connection: keep-alive
Retry-After: Thu, 01 May 2014 16:00:00 GMT

RateLimit-Reset uses the HTTP header date format: RFC 1123 (Thu, 01 Dec 1994 16:00:00 GMT)
```

Exceeding rate limit:

```http
// 429 Too Many Requests
{
    "message": "API rate limit exceeded.",
    "type": "rate_limit_exceeded",
    "documentation_url": {docs_host}
}
```

## TLS/SSL

All API request MUST be made over SSL, including outgoing web hooks. Any non-secure requests
return `ssl_required`, and no redirects are performed.

```http
HTTP/1.1 403 Forbidden
Content-Length: 35

{
  "message": "API requests must be made over HTTPS",
  "type": "ssl_required",
  "docs": {docs_host}
}
```
