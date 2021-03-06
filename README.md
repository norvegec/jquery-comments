# jquery-comments
this is a fork of https://github.com/Viima/jquery-comments
main goal is to add IE8 support, and cut navigation panel

![Screenshot of jquery-comments](screenshot.png?raw=true "Screenshot of jquery-comments")

Features
--------
- Commenting, replying (nested comments), editing, deleting and upvoting
- Enabling/disabling functionalities
- Localization
- Time formatting
- Field mappings
- Callbacks
- Fully responsive
- Miscellaneous settings

Quick start
-----------
**1) Add the following to your HTML file**
```html
<link rel="stylesheet" type="text/css" href="css/jquery-comments.css">
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css"> <!-- Optional -->

<script type="text/javascript" src="js/lib/jquery-1.9.0.min.js"></script>
<script type="text/javascript" src="js/jquery-comments.js"></script>
```

**2) Initialize the library**
```javascript
$('#comments-container').comments({
    profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
    getComments: function(success, error) {
        var commentsArray = [{
            id: 1,
            created: '2015-10-01',
            content: 'Lorem ipsum dolort sit amet',
            fullname: 'Simon Powell',
            profile_picture_url: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
            upvote_count: 2,
            user_has_upvoted: false
        }];
        success(commentsArray);
    }
});
```
If you are not using Font Awesome for icons, you should replace the icons with custom images by overriding following options when initializing the library:
```javascript
spinnerIconURL: 'img/spinner.gif',
upvoteIconURL: 'img/upvote-icon.png',
replyIconURL: 'img/reply-icon.png',
noCommentsIconURL: 'img/no-comments-icon.png',
```

Dependencies
------------
- jQuery >= 1.9.0
- Font Awesome (optional)

Documentation
-------------
http://viima.github.io/jquery-comments

Maintainers
-----------
- [Joona Tykkyläinen](https://www.linkedin.com/in/joonatykkylainen), Viima Solutions Oy

Browser support
---------------
IE8+ and all modern browsers

Copyright and license
---------------------
Code and documentation copyright 2015 [Viima Solutions Oy](https://www.viima.com/). Code released under [the MIT license](https://github.com/Viima/jquery-comments/blob/master/LICENSE).
