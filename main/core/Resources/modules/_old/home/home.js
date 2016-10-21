import $ from 'jquery'

class Home {
  /**
   * Find urls ina text
   *
   * @param text A string
   *
   * @return An array with urls
   */
  findUrls (text) {
    var source = (text || '').toString()
    var urlArray = []
    var matchArray

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken =
    /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g

    // Iterate through any URLs in the text.
    while ((matchArray = regexToken.exec(source)) !== null) {
      var token = matchArray[0]
      urlArray.push(token)
    }

    return urlArray
  }

  /**
   * Insert the HTML of a new or edited content.
   */
  insertContent (creatorElement, data, type, father, update) {
    update = typeof (update) !== 'undefined' ? update : null

    var contentPath = 'content/' + data + '/' + type

    if (father) {
      contentPath += '/' + father
    }

    $.ajax(home.path + contentPath).done(function (data) {
      if (father && !update) {
        $('.creator' + father).after(data)
        $('.creator' + father).find('.collapse' + father).collapse('hide')
      } else if (father && update) {
        $(creatorElement).parents('.creator' + father).first().replaceWith(data)
      } else if (update) {
        $(creatorElement).replaceWith(data)
      } else {
        $(creatorElement).next().prepend(data).hide().fadeIn('slow')
      }

      $('.contents').trigger('ContentModified')
    })
  }

  /**
   * Empty titles and contents in a creator for each languages.
   */
  emptyContent (creatorElement) {
    $('input', creatorElement).val('')
    $('textarea', creatorElement).val('').data('saved', 'true')
  }

  /**
   * Create or update an element by POST method with ajax.
   *
   * @param [DOM obj] element The .creator element
   * @param [String] id The id of the content, this parameter is optional.
   *
   * @TODO Prevent multiple clicks
   */
  creator (element, id, update) {
    id = typeof (id) !== 'undefined' ? id : null
    update = typeof (update) !== 'undefined' ? update : null

    var creatorElement = $(element).parents('.creator').get(0)
    var form = $('form', creatorElement).first().serializeArray()
    var type = $(creatorElement).data('type')
    var father = $(creatorElement).data('father')
    var route = 'content/create/' + type

    if (father) {
      route += '/' + father
    }

    if (update) {
      route = 'content/update/' + id
    }

    if (!home.creatorIsEmpty(form)) {
      $.post(home.path + route, form)
        .done(function (data) {
          if (!isNaN(data) && data !== '') {
            home.insertContent(creatorElement, data, type, father)
            home.emptyContent(creatorElement)
          } else if (data === 'true') {
            home.insertContent(creatorElement, id, type, father, update)
          } else {
            modal.error()
          }
        })
        .error(function () {
          modal.error()
        })
    }
  }

  /**
   * Reload a content
   */
  reloadContent (element, id, type) {
    $.ajax(routing.generate('claroline_get_content_by_id_and_type', {'content': id, 'type': type}))
      .done(function (data) {
        $(element).replaceWith(data)
        $('.contents').trigger('ContentModified')
      })
      .error(function () {
        modal.error()
      })
  }

  /**
   * Delete a content or a content type.
   *
   * @param element The HTML elementof a content.
   * @param type, in order to delete a type, make this parameter true
   */
  deleteContent (element, type) {
    var path = typeof (type) === 'undefined' || type === false ? 'delete' : 'deletetype'
    var id = element.data('id')

    if (id) {
      $.ajax(home.path + 'content/' + path + '/' + id)
        .done(function (data) {
          if (data === 'true') {
            if (type) {
              element = element.parent()
            }

            element.hide('slow', function () {
              $(this).remove()
              $('.contents').trigger('ContentModified')
            })
          } else {
            modal.error()
          }
        })
        .error(function () {
          modal.error()
        })
    }
  }

  /**
   * Publish content page type
   */
  publishType (element) {
    var id = element.data('id')

    if (id) {
      $.ajax(routing.generate('claro_content_publish_type', {'type': id}))
        .done(function (data) {
          if (data === 'true') {
            $('.type-publish > span', element).text(translator.trans('unpublish', {}, 'platform'))
            $('strong > .text-muted > span', element).text(translator.trans('publish', {}, 'platform'))
            $('strong > .text-muted > .text-danger', element)
              .removeClass('text-danger').addClass('text-success')
          } else {
            $('.type-publish > span', element).text(translator.trans('to_publish', {}, 'platform'))
            $('strong > .text-muted > span', element).text(translator.trans('unpublished', {}, 'platform'))
            $('strong > .text-muted > .text-success', element)
              .removeClass('text-success').addClass('text-danger')
          }
        })
        .error(function () {
          modal.error()
        })
    }
  }

  /**
   * check if a translated content form is empty
   *
   * @param form A serializeArray of a form element
   */
  creatorIsEmpty (form) {
    if (form instanceof Array) {
      for (var lang in form) {
        if (form.hasOwnProperty(lang) && form[lang].value !== undefined && form[lang].value !== '') {
          return false
        }
      }
    }

    return true
  }

  /**
   * Change the size of a home page content.
   *
   * @param size The new size of the content, example: content-12
   * @param id The id of the content
   * @param type The type of the content
   * @param element The html elment to change after modify the content.
   */
  changeSize (size, id, type, element) {
    if (id && type && element) {
      $.post(home.path + 'content/update/' + id + '/' + size + '/' + type)
        .done(function (data) {
          if (data === 'true') {
            $(element).removeClass(function (index, css) {
              return (css.match(/\bcontent-\d+/g) || []).join(' ')
            })
            modal.hide()
            $(element).addClass(size)
            $(element).trigger('DOMSubtreeModified') // height resize event
            $('#sizes').modal('hide')
            $('.contents').trigger('ContentModified')
          } else {
            modal.error()
          }
        })
        .error(function () {
          modal.error()
        })
    }
  }

  /**
   * Put a content in a region (top, left, right, content and footer)
   *
   * @param name The name of the region
   * @param id The id of the content to put in a region
   */
  changeRegion (name, id) {
    if (name && id) {
      $.ajax(home.path + 'region/' + name + '/' + id)
        .done(function () {
          location.reload()
        })
        .error(function () {
          modal.error()
        })
    }
  }

  /**
   * Update collapse attribute of a content
   */
  collapse (element, id, type) {
    $.ajax(routing.generate('claroline_content_collapse', {'content': id, 'type': type}))
      .done(function (data) {
        if (data === 'true') {
          home.reloadContent(element, id, type)
        } else {
          modal.error()
        }
      })
      .error(function () {
        modal.error()
      })
  }

  /**
   * Get content from a external url and put it in a creator of contents.
   *
   * @param url The url of a webpage.
   */
  generatedContent (url, action, error) {
    error = typeof (error) !== 'undefined' ? error : true

    $.post(home.path + 'content/graph', { 'generated_content_url': url })
      .done(function (data) {
        if (data !== 'false') {
          action(data)
        }
      })
      .error(function () {
        if (error) {
          modal.error()
        }
      })
  }
}

var home = new Home()
window.Claroline.Home = home
var modal = window.Claroline.Modal
var routing = window.Routing
var translator = window.Translator

home.path = $('#homePath').html() // global
home.locale = $('#homeLocale').html() // global
home.asset = $('#homeAsset').html() // global

if (!home.path) {
  home.path = './'
}

if (!home.locale) {
  home.locale = 'en'
}

if (!home.asset) {
  home.asset = './'
}

$('body').on('click', '.content-translatable .content-menu .dropdown-menu a', function () {
  var translatable = $(this).parents('.content-translatable').first()
  var lang = $(this).text()
  $('.content-menu button span', translatable).text(lang)
  $('.lang', translatable).each(function () {
    if ($(this).data('lang') === lang) {
      $(this).removeClass('hide')
    } else {
      $(this).addClass('hide')
    }
  })
})

export default home
