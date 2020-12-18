/**
 * @file Plugin to upgrade file fields
 * @copyright Timofey Pronchenok 2020
 * @version 1.0
 */

(function( $ ) {

  /**
   * 
   * @namespace
   */
  let methods = {
      init: function(params) {
        let $this = this;

          return this.each(function() {

     /**
      * Настройки по умолчанию 
      * 
      * dragClass - Установка класса для DnD
      * sizeFile - Установка размера файла
      * minCount - Минимальное количество файлов
      * maxCount - Максимальное количество файлов
      * preview - Вывод превью
      * previewWidth - Ширина превью
      * previewHeight - Высота превью
      * removability - Удаление файлов
      * url - Адрес отправки запросов
      * 
      */
      let def_settings = $.extend({
        'dragClass'    : 'activeDrag',
        'sizeFile'     : 100000000000,
        'minCount'     : 1,
        'maxCount'     : 10,
        'preview'      : true,
        'previewWidth' : 350,
        'previewHeight': 350,
        'removability' : true, 
        'url'          : 'handler.php',
      }, params);
      

/**
 * Преобразование размера файла в удобный вид
 * 
 * @param {String} size - Передаваемое значение в байтах
 * @returns {String} - Вывод преобразованной величины
 * @namespace calcSize
 * @function
 * @example 
 * calcSize(1024)
 *  // => 1 KB
 */

    function calcSize(size) {
      if (size == 0) return '0 Bytes';

      let k = 1024,
          dm = 2,
          sizesArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      let i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizesArr[i];
    }

    
    let objFileFlag = {};

    /**
     * Данная функция осуществяет отправку файлов с дальнейшим выводом индикатора загрузки и последующим выводом списка файлов
     * 
     * @param {Object} listFile - Объект файлов (FileList).
     * @param {object} file - Отправляемый файл.
     * @namespace send
     */

    function send(listFile, file) {
      let xhr = new XMLHttpRequest();
      loadingBlock();
      $('.file_loading').append('<div class="group-loading">'+
            '<p><span>Название: </span>'+ file.name +'</p>'+
            '<p class="load_status"><span>Статус: </span>Загрузка</p>'+
            '<div class="progress_loading">'+
              '<progress value="" max="100"></progress>'+
            '</div>'+
          '</div>');
      let $link_status = $('.file_loading .load_status').last().get(0);
      let progressFile = $('.file_loading .progress_loading progress');
 
      
      let flag = false;

      /**
       * Получение от сервера информации прогресса загруженности файла
       */

      xhr.upload.onprogress = function(event) {
        let percent = parseInt(event.loaded / event.total * 100);
        if(percent == 100) {
          flag = true;
          objFileFlag[file.lastModified] = flag;
        } 
     
        $(progressFile).val(percent)
       console.log(`Отправлено ${event.loaded} из ${event.total} байт ${file.name} флаг ${flag} прогресс ${$(progressFile).val()}` );
      };

       /**
       * Выполнение действий в случае успешной отправки
       */

      xhr.onload = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            if(flag == true) {
              $($link_status).html('Статус: Успешно');
              flag = false;
              xhr.abort();

              if(Object.keys(objFileFlag).length == Object.keys(listFile).length) {
                if(objFileFlag) {

                  let flag = false; 
          
                  $.ajax({
                      type: "POST",
                      url: def_settings.url,
                      data: {objFileFlag},
                      async: false,
                      success: function(answer) {
                          // ... code
                          // ... code
                          // ... code
                          // ... code
                        flag = true

                        if(flag) {
                          isSetFile();               
                            if(def_settings.preview == true) {   
                              $.each(listFile, function(i, v) {
            
                                let regexp = /image\/(jpeg|jpg|png|gif)/;
            
                                if(regexp.test(v.type)) {
                                  preview(v);

                                  // $('.group-img').prepend('<img class="file_del" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/OOjs_UI_icon_close-ltr-destructive.svg/768px-OOjs_UI_icon_close-ltr-destructive.svg.png" alt="">'
                                  // )
                                }
                                else {
                                  let $linkListFile = $('.files_list');
                                  $($linkListFile).append('<div class="group-file" data-id = "'+ v.lastModified +'">'+
                                  '<img class="file_del" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/OOjs_UI_icon_close-ltr-destructive.svg/768px-OOjs_UI_icon_close-ltr-destructive.svg.png" alt="">'+
                                  '<img src="https://www.tangaroa.school.nz/wp-content/uploads/2019/07/wb-doc-icon.png" alt="">'+
                                  '<p>'+ v.name +'</p>'+
                                  '</div>');                                 
                                }
                              })

                              // if(def_settings.removability) {
                              //   $('.file_del').click(function() {
                              //       deleteFile(this);
                              //     })
                              // }

                            }
                            else {
                              $('.preview').remove();
                              let $linkListFile = $('.files_list');
                              $.each(listFile, function(i, v) {
                                $($linkListFile).append('<div class="group-file" data-id = "'+ v.lastModified +'">'+
                                  '<img class="file_del" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/OOjs_UI_icon_close-ltr-destructive.svg/768px-OOjs_UI_icon_close-ltr-destructive.svg.png" alt="">'+
                                  '<img src="https://www.tangaroa.school.nz/wp-content/uploads/2019/07/wb-doc-icon.png" alt="">'+
                                  '<p>'+ v.name +'</p>'+
                                  '</div>');
                              })
                              // $('.file_del').click(function() {
                              //   deleteFile(this);
                              // })
                            }

                            if(def_settings.removability) {
                              $('.group-file').prepend('<img class="file_del" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/OOjs_UI_icon_close-ltr-destructive.svg/768px-OOjs_UI_icon_close-ltr-destructive.svg.png" alt="">'
                              )

                              $('.file_del').click(function() {
                                  deleteFile(this);
                                })
                            }
                        }   
                      },
                        error: function() {
                          errorBlock('Ошибка при загрузке файлов');
                          setTimeout(location.reload(), 3500);
                          return false;
                        }
                      });
          
   
                  }
              }
            }
          } 
          else {
            $($link_status).html('Статус: Ошибка');
          }
        }
      };

      xhr.open('POST', def_settings.url, true);
      xhr.setRequestHeader('X-FILE-ID', file.lastModified);
      xhr.send(file);

      return objFileFlag;
    }


      //
      // Create form 
      //

      let $form = $this.append('<div class="file_block">' +
        '<div class="file_content">'+
          '<div class="header_img_file">'+
            '<img draggable="false" src="img/cloud-computing.png" alt="">'+
          '</div>'+
        '<div class="file-select">'+
          '<label for="file"><img src="img/iconfinder_multimedia-21_2849815.png" alt=""></label>'+
          '<input type="file" name="file" id="file" class="inputfile" multiple />'+
          '<label for="file">Выберите файл</label>'+
        '</div>');

    
      // 
      // Error Block
      //

      /**
       * Блок ошибки (всплывающее окно)
       * @param {String} text Текст ошибки
       * @namespace errorBlock
       * @function
       */

      
      function errorBlock(text) {
        $('body').find('.overlay').remove();
        $('body').find('.action_stub').remove();

       let $errorLink =  $('body').append('<div class="overlay"></div>'+
       '<div class="action_stub">'+
          '<p>'+text+'</p>'+
          '<div class="button_stub">'+
            '<button>Хорошо</button>'+
          '</div>'+
        '</div>');

        $('.overlay').css({
          'display'     : 'block',
          'background'  : '#000',
          'position'    : 'fixed',
          'top'         : 0,
          'left'        : 0,
          'height'      : '100%',
          'width'       : '100%',
          'opacity'     : 0.5,
          'z-index'     : 9990,
        });

        $('.action_stub').css({
          'display'     : 'block',
          'position'    : 'fixed',
          'width'       : '55%',
          'min-height'  : '250px',
          'z-index'     :  9999,
          'padding'     : '15px 15px 20px',
          'background'  : '#000000c4',
          'top'         : '50%',
          'left'        : '50%',
          'transform'   :'translate(-50%, -50%)'
        });

        $('.action_stub .button_stub button').css({
          'width'         : '200px',
          'height'        :'45px',
          'background'    : '#2be73eb8',
          'border'        : 0,
          'outline'       : 'none',
          'border-radius' : '5px',
          'cursor'        : 'pointer',
          'color'         : '#fff',
          'font-size'     : '17px',
          'box-shadow'    : '7px 5px 7px 0px #00000063',
        });

        $('.action_stub .button_stub').css({
          'text-align'    : 'center',
        });

        $('.action_stub p').css({
          'color'         : '#fff',
          'text-align'    : 'center',
          'margin'        : '40px',
          'font-size'     : '1.2em',
        });


        $($errorLink).find('button').click(function() {
          $($errorLink).find('.overlay').remove();
          $($errorLink).find('.action_stub').remove();
        })
      }


     /**
      * Создание блока загрузки
      * 
      * @function
      * @namespace loadindBlock
      * 
      */

      function loadingBlock() {
        $($this).parent().append('<div class="loading_files">'+
                '<div class="loading">'+
                    '<div class="file_loading">'+
                        '<img src="https://i.pinimg.com/originals/49/8f/77/498f7727ecf2a588d6c3eebac92a7c4b.gif" alt="">'+
                    '</div>'+
                '</div>');
      
        $($this).remove();
      };



     /**
      * Список файлов
      * @param {*} event 
      * @function
      * @namespace isSetFile
      * 
      */
      function isSetFile(event) {
        $('.loading_files').parent().append('<div class="list_files">'+
                '<h2>Загруженные файлы</h2>'+
                '<div class="preview">'+
                    '<p>Изображения</p>'+
                    '<div class="img_list">'+
                    '</div>'+
                '</div>'+

                '<div class="files">'+
                    '<p>Файлы</p>'+
                    '<div class="files_list">'+
                    '</div>'+
                '</div>'+
            '</div>');

        $('.loading_files').remove();
      }


  /**
   * Создание превью
   * 
   * 
   * @param {object} file 
   * @function
   * @namespace preview
   */

      function preview(file) {
        let reader = new FileReader();
        reader.addEventListener('load', function(event) {
            let img = document.createElement('img');
            let div = document.createElement('div');
            $(img).attr('src', event.target.result);

            let img_preview = $(div).attr({'class':'group-file', 'data-id': file.lastModified}).append(img)
            $('.img_list').prepend(img_preview).find('img').css({
              'width' : def_settings.previewWidth,
              'height': def_settings.previewHeight,
            });
        });
        reader.readAsDataURL(file);
    }


     /**
      * Удаление файлов. 
      * 
      * @param {String} del Параметр содержит ссылку на файл
      * @function
      * @namespace deleteFile
      */
       

      function deleteFile(del) {
        $parrent = $(del).parent();
        let $id_file = $($parrent).data('id');
        $($parrent).remove();

        /**
           * Отправка Id файла на сервер для дальнейшего удаление
           * @param data {String | Number} - Id файла
           * @param type {String} - Метод отправки POST|GET
           * @param url {String} - Ссылка обработчика
           * @param async {Boolean} - Асинхронный/синхронный способ отправки
           * @param success {Function} - Выполнение определенных действий в случае успешной отправки
           * @param error {Function} - Выполнение определенных действий в случае неуспешной отправки
           * @namespace deleteFile.Ajax
           * @method
           */
        
        $.ajax({
          type: "POST",
          url: def_settings.url,
          data: {$id_file},
          async: true,
          
          success: function(answer) {
            let flag = false;
            
              // ... code
              // ... code
              // ... code
              // ... code

              if(flag == true) {
                errorBlock('Ошибка при удалении');
                return false;
              }
          },
            error: function() {
              errorBlock('Ошибка при удалении');
              setTimeout(location.reload(), 3500);
              return false;
            }
          });

          return false;
      }

      // 
      // Drag & Drop
      //


      let $dropZone = $('.file_content');
      $($dropZone).find('img').each(function(){ $(this).on("mousedown", function() {return false})});

      // Check supports Drag & Drop
      if (typeof(window.FileReader) == 'undefined') {
       errorBlock('Drag & Drop не поддерживается вашим браузером');
      }

      $($this).find('.file_block').prepend('<div class="dnd"><p>Перетащите файл в эту область</p></div>');

      let $dnd = $('.file_block .dnd');
      let $file_select = $('.file_block .file-select');

    
      $($this)
        .on('dragover dragenter', function(event) { 
          event.preventDefault();  
          event.stopPropagation();
          $dnd.addClass(def_settings.dragClass);
          $($file_select).css({ "pointer-events": "none"})
        })
          
        .on('dragleave dragend drop', function(event) {
          event.preventDefault();  
          event.stopPropagation();
          $dnd.removeClass(def_settings.dragClass);
          $($file_select).css({ "pointer-events": "auto"});
        })

        .on('drop', function(event) {  
          event.preventDefault();
          $dnd.removeClass(def_settings.dragClass);
          $($file_select).css({ "pointer-events": "auto"});

            let $file = event.originalEvent.dataTransfer.files;

            //Check count files (max min)
            if($file.length > def_settings.maxCount) {
              errorBlock('Вы можете загрузить максимум '+ def_settings.maxCount +' файлов');
            }
            else if ($file.length < def_settings.minCount) {
              errorBlock('Вы можете загрузить минимум '+ def_settings.minCount +' файла');
            }
            else {
            // Check size files
              $.each($file, function(i, v) {
                if (v.size > def_settings.sizeFile) {
                  errorBlock('Файл '+ this.name +' слишком большой! Файл должен быть не больше '+ calcSize(def_settings.sizeFile) +'');
                  $($file).value = "";
                  return false;
                }
                if(v.size == 0) {
                  errorBlock('Запрещено загружать пустые файлы и папки!');
                  $($file).value = "";
                  return false;
                }
                send($file, v);
              });
          }
        });



      // 
      // INPUT FILE DOWNLOAD
      //



      $($this).find('.inputfile').change(function () {
        if(this.files) {
          $fileInput = this.files;

          if($fileInput.length > def_settings.maxCount) {
            errorBlock('Вы можете загрузить максимум '+ def_settings.maxCount +' файлов');
          }
          else if ($fileInput.length < def_settings.minCount) {
            errorBlock('Вы можете загрузить минимум '+ def_settings.minCount +' файла');
          }
          else {
          // Check size files
            $.each($fileInput, function(i, v) {
              if (v.size > def_settings.sizeFile) {
                errorBlock('Файл '+ this.name +' слишком большой! Файл должен быть не больше '+ calcSize(def_settings.sizeFile) +'');
                $($fileInput).value = "";
                return false;
              }

              if(v.size == 0) {
                errorBlock('Запрещено загружать пустые файлы и папки!');
                $($fileInput).value = "";
                return false;
              }


              send($fileInput, v);
            });
          }
        }
      })

    })

    }
  }


    $.fn.pluginFile = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
          } else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
          } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.tooltip' );
          } 

    };
  })(jQuery);

  $('.pluginFile').pluginFile();



