var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    /* When the search button is clicked, this will call the function that will
       pass the search value to the api request  */
    'click #search-button': 'getSearchTermForApiCall',

    /* This should change the current video set on the app model to the video that
       is clicked  */
    'click .video-thumbnail': 'changeCurrentVideoOnAppModel'

  },

  initialize: function () {
    this.$searchTerm = this.$('#search-input');

    // This will listen for a reset on the videos collection and render the entire page
    this.listenTo(this.model.get('videosCollection'), 'reset', this.renderVideosFromCollection);

    /* This will listen to the AppViews model (AppModel's) attribute of 
       current_video to change, which will happen when we click a video in the list  */
    this.listenTo(this.model, 'change:current_video', this.renderCurrentVideo);
  },

  /* This function will get called when the user clicks the search button and the
     search term(s) will be grabbed and used to update our collection's url  */
  getSearchTermForApiCall: function () {
    if (this.$searchTerm.val()) {

      this.model.updateURLWithNewSearchTerm(this.$searchTerm.val());

    }
  },

  /* This will change the current_video attribute on the app model and set it to
     the clicked video  */
  changeCurrentVideoOnAppModel: function (event) {

    /* We're setting the id of the thumbnail image element in the handlebars
       template, so we can access the id (which is the video model's id), to then
       change the current_video attribute on the app model to the one that is
       clicked  */
    var clickedVideoId = $(event.currentTarget).attr('id');

    this.model.changeCurrentVideo(clickedVideoId);

  },

  /* This is called in the process of rendering a new page from the
     renderVideosFromCollection function. We will create a new videoview for each
     video model and append it to the video list div on the page  */
  renderVideo: function (videoModel) {
    var videoView = new VideoView({ model: videoModel });

    this.$('#video-list-div').append(videoView.render().el);
  },

  /* This function will be triggered when the videosCollection is reset. It will
     first clear (empty) the list of videos in the DOM, then iterate through the 
     videosCollection and render each videoModel (using the renderVideo function) */
  renderVideosFromCollection: function () {
    this.$('#video-list-div').empty();

    this.model.get('videosCollection').each(function (videoModel) {
      this.renderVideo(videoModel);
    }, this);

    /* Each time a new collection of videos is rendered, we will also set the 
       current_video attribute of the model to be the first videoModel in our 
       collection, just as a default. Because we have a listener for a change
       in the current_video of the model, the listener will trigger the current
       video to render as the main video on the display  */
    this.model.set('current_video', this.model.get('videosCollection').models[0]);

    this.$searchTerm.val('');
  },

  /* This function will get called when the user clicks a video on the list or 
     when the current_video is changed as a result of a new search/api call. 
     We'll create a currentVideoView and attach the current_video model to this view.
     We'll then append (render) the current_video to the current-video-div  */
  renderCurrentVideo: function () {
    this.$('#current-video-div').empty();

    var currentVideoView = new VideoView({ model: this.model.get('current_video') });

    this.$('#current-video-div').append(currentVideoView.renderCurrent().el);
  }

})




