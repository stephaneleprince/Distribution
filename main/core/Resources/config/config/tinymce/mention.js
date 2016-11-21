import 'claroline-tinymce-mention/plugin.min'
import _ from 'lodash'
import $ from 'jquery'
import tinymce from 'tinymce/tinymce'
import home from '#/main/core/_old/home/home'

var routing = window.Routing
tinymce.DOM.loadCSS(home.asset + 'packages/claroline-tinymce-mention/css/autocomplete.css')

/**
 * @todo documentation
 */
var mentionsSource = function(query, process, delimiter) {
  if (!_.isUndefined(window.Workspace) && !_.isNull(window.Workspace.id)) {
    if (delimiter === '@' && query.length > 0) {
      var searchUserInWorkspaceUrl = routing.generate('claro_user_search_in_workspace') + '/'

      $.getJSON(searchUserInWorkspaceUrl + window.Workspace.id + '/' + query, function(data) {
        if (!_.isEmpty(data) && !_.isUndefined(data.users) && !_.isEmpty(data.users)) {
          process(data.users)
        }
      })
    }
  }
}

/**
 * @todo documentation
 */
var mentionsItem = function(item) {
  var avatar = '<i class="fa fa-user"></i>'
  if (item.avatar !== null) {
    avatar = '<img src="' + home.asset + 'uploads/pictures/' + item.avatar + '" alt="' + item.name +
      '" class="img-responsive">'
  }

  return '<li>' +
  '<a href="javascript:;"><span class="user-picker-dropdown-avatar">' + avatar + '</span>' +
  '<span class="user-picker-dropdown-name">' + item.name + '</span>' +
  '<small class="user-picker-avatar-mail text-muted">(' + item.mail + ')</small></a>' +
  '</li>'
}

/**
 * @todo documentation
 */
var mentionsInsert = function(item) {
  var publicProfileUrl = routing.generate('claro_public_profile_view') + '/'

  return '<user id="' + item.id + '"><a href="' + publicProfileUrl + item.id + '">' + item.name + '</a></user>'
}

export default {
    'source': mentionsSource,
    'render': mentionsRender,
    'insert': mentionsInsert,
    'delay': 200
}
