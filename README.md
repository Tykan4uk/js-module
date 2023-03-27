## About The Project

This project implements UI for moderation. 
Backend - C# REST API.
Database - MS SQL.

The site allows:
1) Upload music files and send them to API, where they are trimmed to 10-second fragment, stored in BLOB-storage, and write song information to database;
2) Search added songs, listen to them, and report any mistake in description.

Design Reference: [design]([https://example.com](https://app.moqups.com/LTb5zOxHHLW3tRfnELOA6ExzimJVOVAV/view/page/ae14d583d))

## Minimum set for the module

During this module, I must implement following minimum functionality:
1) Viewing list of music;
2) Pagination and page size;
3) Downloading files.

## Roadmap

Functionality that will probably be implemented by next module on React.

1) Sequential sorting by name (for example, first by author, then by song title);
2) Listening to music fragment;
3) Ability to send report on incorrect song data;
4) Progress bar while downloading files;
5) Registration/Authorization/Authentication. 
