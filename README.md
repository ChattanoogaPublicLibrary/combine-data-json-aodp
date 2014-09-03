# combine-data-json-aodp

## What is it?

It combines the provided paginated data.json for your ArcGIS Open Data Portal.

## Why?

The data.json catalog in the ArcGIS Open Data portal is paginated. The standard way for serving data.json for consumption is not to paginate. For folks and services that use data.json in the expected way, a paginated data.json won't work.

## How do I use it?

`http://localhost:3000/:schema/:baseUrl/data.json`
So if your ArcGIS Open Data Portal was located at:

`http://myportal.mysite.com`
You would access data.json via this URL:
`http://localhost:3000/http/myportal.mysite.com/data.json`

## License

This project is under the MIT license. See `LICENSE` for more information.
