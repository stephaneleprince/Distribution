/**
 * @todo documentation
 */
function mentionsSource(query, process, delimiter) {
  if (!isUndefined(window.Workspace) && !isNull(window.Workspace.id)) {
    if (delimiter === '@' && query.length > 0) {
      var searchUserInWorkspaceUrl = url('claro_user_search_in_workspace') + '/'

      $.getJSON(searchUserInWorkspaceUrl + window.Workspace.id + '/' + query, function (data) {
        if (!isEmpty(data) && !isUndefined(data.users) && !isEmpty(data.users)) {
          process(data.users)
        }
      })
    }
  }
}

/**
 * @todo documentation
 */
function mentionsItem(item) {
  var avatar = '<i class="fa fa-user"></i>'
  if (item.avatar !== null) {
    avatar = '<img src="' + asset('uploads/pictures/' + item.avatar) + '" alt="' + item.name +
      '" class="img-responsive" />'
  }

  return '<li>' +
    '<a href="javascript:;"><span class="user-picker-dropdown-avatar">' + avatar + '</span>' +
    '<span class="user-picker-dropdown-name">' + item.name + '</span>' +
    '<small class="user-picker-avatar-email text-muted">(' + item.email + ')</small></a>' +
    '</li>'
}

function mentionsInsert(item) {
  return (`
    <user id="${item.id}">
      <a href="${url('claro_user_profile')}/${item.id}">@${item.name}</a>
    </user>
  `)
}