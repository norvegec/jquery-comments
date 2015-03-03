describe('Basic features', function() {

    var comments;

    beforeEach(function() {
        var commentsContainer = $('<div/>');

        commentsContainer.comments({
            spinnerImageURL: '../img/ajax-loader.gif',
            profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
            roundProfilePictures: true,
            textareaRows: 1,
            textareaMaxRows: 4,
            getComments: function(callback) {
                callback(commentsArray);
            },
            postComment: function(data, success, error) {
                setTimeout(function() {
                    success(data)
                }, 10);
            }
        });

        // Append element to DOM
        $('body').append(commentsContainer);
        
        // Save the instance to global scope
        comments = $('.jquery-comments').data().comments;
    });

    it('Should call the required functions upon refresh', function() {
        spyOn(comments, 'render').andCallThrough();
        spyOn(comments, 'fetchDataAndRender').andCallThrough();
        spyOn(comments, 'createCommentModel').andCallThrough();
        spyOn(comments, 'addCommentToDataModel').andCallThrough();
        spyOn(comments, 'sortComments').andCallThrough();

        comments.fetchDataAndRender();

        expect(comments.render.calls.length).toEqual(1);
        expect(comments.fetchDataAndRender.calls.length).toEqual(1);
        expect(comments.createCommentModel.calls.length).toEqual(9);
        expect(comments.addCommentToDataModel.calls.length).toEqual(9);
        expect(comments.sortComments.calls.length).toBeGreaterThan(1);
    });

    it('Should have rendered the comments', function() {
        var commentElements = $('li.comment');
        expect(commentElements.length).toEqual(9);
        commentElements.each(function(index, commentEl) {
            checkCommentElementData($(commentEl));
        });
        checkOrder($('ul#comment-list > li.comment'), [1,3,2]);
    });

    it('Should have appended the child comments under their outermost parent', function() {
        expect($('#comment-list > li.comment').length).toBe(3);
        checkOrder($('li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9]);
        checkOrder($('li.comment[data-id=2] .child-comments > li.comment'), []);
        checkOrder($('li.comment[data-id=3] .child-comments > li.comment'), [4,5]);
    });

    it('Should sort the main level comments wihtout affecting the order of child comments', function() {
        $('li[data-sort-key="popularity"]').click();
        checkOrder($('#comment-list > li.comment'), [1,3,2]);
        checkOrder($('li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9]);

        $('li[data-sort-key="newest"]').click();
        checkOrder($('#comment-list > li.comment'), [3,2,1]);
        checkOrder($('li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9]);

        $('li[data-sort-key="oldest"]').click();
        checkOrder($('#comment-list > li.comment'), [1,2,3]);
        checkOrder($('li.comment[data-id=1] .child-comments > li.comment'), [6,7,8,9]);
    });


    it('Should be able to toggle all replies', function() {
        var toggleAll = $('li.comment[data-id=1]').find('.child-comments li.toggle-all');
        expect(toggleAll.length).toBe(1);
        expect(toggleAll.text()).toBe('View all 4 replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(2);

        // Show all replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('Hide replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(4);

        // Hide replies
        toggleAll.click();
        expect(toggleAll.text()).toBe('View all 4 replies');
        expect($('li.comment[data-id=1] li.comment:visible').length).toBe(2);
    });

    describe('Commenting field', function() {

        var mainCommentingField;
        var mainTextarea;
        var lineHeight;

        beforeEach(function() {
            mainCommentingField = $('.commenting-field.main');
            mainTextarea = mainCommentingField.find('.textarea');
            lineHeight = parseInt(mainTextarea.css('line-height'));
        });

        it('Should adjust the height dynamically', function() {

            // Should have 1 row
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);

            // Should have 2 rows
            mainTextarea.trigger('focus').focus();
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 2 rows
            mainTextarea.append($('<div>row 1</div>')).trigger('input');
            mainTextarea.append($('<div>row 2</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 3 rows
            mainTextarea.append($('<div>row 3</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(3*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(4*lineHeight);

            // Should have 4 rows
            mainTextarea.append($('<div>row 4</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(4*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(5*lineHeight);

            // Should have 4 rows as it's the max value
            mainTextarea.append($('<div>row 5</div>')).trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(4*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(5*lineHeight);

            // Should have 3 rows
            mainTextarea.find('div').last().remove();
            mainTextarea.find('div').last().remove();
            mainTextarea.trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(3*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(4*lineHeight);

            // Should have 2 rows
            mainTextarea.find('div').remove();
            mainTextarea.trigger('input');
            expect(mainTextarea.outerHeight()).toBeGreaterThan(2*lineHeight);
            expect(mainTextarea.outerHeight()).toBeLessThan(3*lineHeight);

            // Should have 1 row
            mainCommentingField.find('.close').click();
            expect(mainTextarea.outerHeight()).toBeLessThan(2*lineHeight);

        });

        it('Should enable control row on focus', function() {
            var controlRow = mainCommentingField.find('.control-row');;

            // Show on focus
            expect(controlRow.is(':visible')).toBe(false);
            mainTextarea.trigger('focus').focus();
            expect(controlRow.is(':visible')).toBe(true);

            // Hide when clicking close icon
            mainCommentingField.find('.close').click();
            expect(controlRow.is(':visible')).toBe(false);
        });

        it('Should enable send button when texarea is not empty', function() {
            var sendButton = mainCommentingField.find('.send');

            expect(sendButton.is(':visible')).toBe(false);
            expect(sendButton.hasClass('enabled')).toBe(false);
            
            // Show on focus
            mainTextarea.trigger('focus').focus();
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(false);

            // Enable when content
            mainTextarea.append($('<div>row 1</div>')).trigger('input');
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(true);

            // Disable when no content
            mainTextarea.empty().trigger('input');
            expect(sendButton.is(':visible')).toBe(true);
            expect(sendButton.hasClass('enabled')).toBe(false);

            // Hide when clicking close icon
            mainCommentingField.find('.close').click();
            expect(sendButton.is(':visible')).toBe(false);
            expect(sendButton.hasClass('enabled')).toBe(false);
        });
    
        it('Should able to add a new main level comment', function() {
            var newCommentText = 'New main level comment';
            
            mainTextarea.trigger('focus').focus();
            mainTextarea.html(newCommentText).trigger('input');
            mainCommentingField.find('.send').trigger('click');

            var commentCount = comments.getComments().length;
            wait(function() {
                return comments.getComments().length == commentCount + 1;
            });

            run(function() {
                // New comment should always be placed first initially
                var commentEl = $('li.comment').first();
                var idOfNewComment = commentEl.data().id;

                expect(commentEl.find('.content').text()).toBe(newCommentText);
                expect(commentEl.hasClass('by-current-user')).toBe(true);
                checkCommentElementData(commentEl);

                // Check that sorting works also with the new comment
                checkOrder($('#comment-list > li.comment'), [idOfNewComment, 1,3,2]);
                $('li[data-sort-key="oldest"]').click();
                checkOrder($('#comment-list > li.comment'), [1,2,3,idOfNewComment]);
                $('li[data-sort-key="newest"]').click();
                checkOrder($('#comment-list > li.comment'), [idOfNewComment,3,2,1]);
            });
        });

        describe('Reply field', function() {

            var mostPopularComment;

            beforeEach(function() {
                mostPopularComment = $('li.comment[data-id=1]');
            });

            it('Should be hidden by default', function() {
                var replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.length).toBe(0);
            });

            it('Should be able to reply to the original user', function() {
                mostPopularComment.find('.reply').first().click();
                var replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.length).toBe(1);
                expect(replyField.find('.reply-to-badge').length).toBe(0);

                // Check that the field is last child
                var lastChild = mostPopularComment.children().last().children().last();
                expect(lastChild[0]).toBe(replyField[0]);

                var replyText = 'This is a reply';
                replyField.find('.textarea').html(replyText).trigger('input');
                replyField.find('.send').trigger('click');

                var commentCount = comments.getComments().length;
                wait(function() {
                    return comments.getComments().length == commentCount + 1;
                });
                run(function() {
                    // New reply should always be placed last
                    var commentEl = mostPopularComment.find('li.comment').last();
                    var idOfNewComment = commentEl.data().id;

                    expect(commentEl.find('.content').text()).toBe(replyText);
                    expect(commentEl.hasClass('by-current-user')).toBe(true);
                    checkCommentElementData(commentEl);

                    // Check position
                    checkOrder(mostPopularComment.find('li.comment'), [6,7,8,9,idOfNewComment]);

                    var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                    expect(toggleAllText).toBe('View all 5 replies');
                    expect(mostPopularComment.find('li.comment:visible').length).toBe(2);
                });
            }); 

            it('Should close the reply field when clicking the close icon', function() {
                mostPopularComment.find('.reply').first().click();
                var replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.length).toBe(1);
                replyField.find('.close').click();

                replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.length).toBe(0);
            });

            it('Should be able to re-reply', function() {
                var childComment = mostPopularComment.find('.child-comments li.comment').last();
                childComment.find('.reply').first().click();
                var replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.find('.reply-to-badge').val()).toBe('@Bryan Connery');

                // Check that the field is last child
                var lastChild = mostPopularComment.children().last().children().last()
                expect(lastChild[0]).toBe(replyField[0]);

                var replyText = 'This is a re-reply';
                replyField.find('.textarea').html(replyText).trigger('input');
                replyField.find('.send').trigger('click');

                var commentCount = comments.getComments().length;
                wait(function() {
                    return comments.getComments().length == commentCount + 1;
                });
                run(function() {
                    // New reply should always be placed last
                    var commentEl = mostPopularComment.find('li.comment').last();
                    var idOfNewComment = commentEl.data().id;

                    expect(commentEl.find('.name .reply-to').text().indexOf('Bryan Connery')).not.toBe(-1);
                    expect(commentEl.find('.content').text()).toBe(replyText);
                    expect(commentEl.hasClass('by-current-user')).toBe(true);
                    checkCommentElementData(commentEl);

                    var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                    expect(toggleAllText).toBe('View all 5 replies');
                    expect(mostPopularComment.find('li.comment:visible').length).toBe(2);
                });
            });

            it('Should be able to re-reply to a hidden reply', function() {
                mostPopularComment.find('.toggle-all').click();
                var childComment = mostPopularComment.find('.child-comments li.comment').first();
                childComment.find('.reply').first().click();

                var replyField = mostPopularComment.find('.commenting-field');
                expect(replyField.find('.reply-to-badge').val()).toBe('@Jack Hemsworth');

                var replyText = 'This is a re-reply';
                replyField.find('.textarea').html(replyText).trigger('input');
                replyField.find('.send').trigger('click');

                var commentCount = comments.getComments().length;
                wait(function() {
                    return comments.getComments().length == commentCount + 1;
                });
                run(function() {
                    // New reply should always be placed last
                    var commentEl = mostPopularComment.find('li.comment').last();
                    var idOfNewComment = commentEl.data().id;

                    expect(commentEl.find('.name .reply-to').text().indexOf('Jack Hemsworth')).not.toBe(-1);
                    expect(commentEl.find('.content').text()).toBe(replyText);
                    expect(commentEl.hasClass('by-current-user')).toBe(true);
                    checkCommentElementData(commentEl);

                    var toggleAllText = mostPopularComment.find('li.toggle-all').text();
                    expect(toggleAllText).toBe('Hide replies');
                    expect(mostPopularComment.find('li.comment:visible').length).toBe(5);
                });
            });

            it('Should reply to original user when erasing the reply-to badge', function() {
                var childComment = mostPopularComment.find('.child-comments li.comment').last();
                childComment.find('.reply').first().click();
                var replyField = mostPopularComment.find('.commenting-field');
                var textarea = replyField.find('.textarea');
                expect(parseInt(textarea.attr('data-parent'))).toBe(childComment.data().model.id);

                textarea.empty().trigger('input');
                expect(parseInt(textarea.attr('data-parent'))).toBe(1);

                var replyText = 'This is a re-reply to original user';
                replyField.find('.textarea').html(replyText).trigger('input');
                replyField.find('.send').trigger('click');

                var commentCount = comments.getComments().length;
                wait(function() {
                    return comments.getComments().length == commentCount + 1;
                });
                run(function() {
                    var commentEl = mostPopularComment.find('li.comment').last();
                    expect(commentEl.find('.name .reply-to').length).toBe(0);
                });
            });

        });

    });

    afterEach(function() {
        $('.jquery-comments').remove();
    });


    // Helpers
    // =======

    function wait(callback) {
        $('.jquery-comments').hide();
        waitsFor(callback);
    }

    function run(callback) {
        runs(function() {
            $('.jquery-comments').show();
            callback();
        });
    }

    function checkCommentElementData(commentEl) {
        var nameContainer = commentEl.find('.name').first();

        // Fields to be tested
        var profilePicture = commentEl.find('img.profile-picture').first().attr('src');
        var replyTo = nameContainer.find('.reply-to').text();
        var fullname = replyTo.length ? nameContainer.text().split(replyTo)[0] : nameContainer.text();
        var content = commentEl.find('.content').first().text();
        var dateUI = new Date(commentEl.find('time').first().text());

        // Model that we are testing against
        var commentModel = commentEl.data().model;

        // Check basic fields
        expect(profilePicture).toBe(commentModel.profilePictureURL);
        expect(fullname).toBe(commentModel.fullname);
        expect(content).toBe(commentModel.content);

        // Check reply to -field
        if(commentModel.parent) {
            var parent = comments.commentsById[commentModel.parent];
            if(parent.parent) {
                expect(replyTo.indexOf(parent.fullname)).not.toBe(-1);
            } else {
                expect(replyTo.length).toBe(0);
            }
        } else {
            expect(replyTo.length).toBe(0);
        }

        // Check time
        var modelCreatedDate = new Date(commentModel.created);
        expect(dateUI.getDate()).toBe(modelCreatedDate.getDate());
        expect(dateUI.getMonth()).toBe(modelCreatedDate.getMonth());
        expect(dateUI.getFullYear()).toBe(modelCreatedDate.getFullYear());
    }

    function getOrder(elements) {
        return elements.map(function(index, commentEl){return $(commentEl).data().id}).toArray();
    }

    function checkOrder(elements, expectedOrder) {
        var order = getOrder(elements);
        expect(JSON.stringify(order)).toBe(JSON.stringify(expectedOrder));
    }

});