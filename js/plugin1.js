(function( $ ) {

  let methods = {
      init: function(params) {
        let $this = this;

          return this.each(function() {

      // 
      // Settings
      //

      let def_settings = $.extend({
        'dragClass'    : 'activeDrag',
        'sizeFile'     : 100000000000,
        'minCount'     : 1,
        'maxCount'     : 100,
        'preview'      : true,
        'previewWidth' : 350,
        'previewHeight': 350,
        'removability' : true, 
        'url'          : 'handler.php',
      }, params);
      
// Calculate transformations size 
    function calcSize(size) {
      if (size == 0) return '0 Bytes';

      let k = 1024,
          dm = 2,
          sizesArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      let i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizesArr[i];
    }

// send file

    let objFileFlag = {};
    function send(file) {
      let xhr = new XMLHttpRequest();
      loadingBlock();
      $('.file_loading').append('<div class="group-loading">'+
            '<p><span>Название: </span>'+ file.name +'</p>'+
            '<p class="load_status"><span>Статус: </span>Загрузка</p>'+
            '<div class="progress_loading">'+
              '<progress value="" max="100"></progress>'+
            '</div>'+
          '</div>');
          console.log($('.file_loading .load_status'))
      let $link_status = $('.file_loading .load_status').last().get(0);
      let progressFile = $('.file_loading .progress_loading progress');
 
      
      let flag = false;
      xhr.upload.onprogress = function(event) {
        let percent = parseInt(event.loaded / event.total * 100);
        if(percent == 100) {
          flag = true;
          objFileFlag[file.lastModified] = flag;
        } 
     
        $(progressFile).val(percent)
       console.log(`Отправлено ${event.loaded} из ${event.total} байт ${file.name} флаг ${flag} прогресс ${$(progressFile).val()}` );
      };

      xhr.onload = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            if(flag == true) {
              $($link_status).html('Статус: Успешно');
              flag = false;
              xhr.abort();


              
            }
          } else {
            $($link_status).html('Статус: Ошибка');
          }
        }
      };

console.log(file)
      xhr.open('POST', def_settings.url, true);
      xhr.setRequestHeader('X-FILE-ID', file.lastModified);
      xhr.send(file);

      // xhr.abort()

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


      // 
      // Loading block
      //


      function loadingBlock() {
        $($this).parent().append('<div class="loading_files">'+
                '<div class="loading">'+
                    '<div class="file_loading">'+
                        '<img src="https://i.pinimg.com/originals/49/8f/77/498f7727ecf2a588d6c3eebac92a7c4b.gif" alt="">'+
                    '</div>'+
                '</div>');
      
        $($this).remove();
      };



      // 
      // List Files 
      //


      function isSetFile(event) {
        $('.loading_files').parent().append('<div class="list_files">'+
                '<h2>Загруженные файлы</h2>'+
                '<div class="preview">'+
                    '<p>Изображения</p>'+
                    '<div class="img_list">'+
                //         <div class="group-img">
                //             <img src="https://fainaidea.com/wp-content/uploads/2019/06/acastro_190322_1777_apple_streaming_0003.0.jpg" alt="">
                        // </div>
                    '</div>'+
                '</div>'+

                '<div class="files">'+
                    '<p>Файлы</p>'+
                    '<div class="files_list">'+
                        // <div class="group-file">
                        //     <img src="https://www.tangaroa.school.nz/wp-content/uploads/2019/07/wb-doc-icon.png" alt="">
                        //     <p>Название файла</p>
                        // </div>
                    '</div>'+
                '</div>'+
            '</div>');

        $('.loading_files').remove();
      }


      // 
      // Create preview
      //



      function preview(file) {
        let reader = new FileReader();
        reader.addEventListener('load', function(event) {
            let img = document.createElement('img');
            let div = document.createElement('div');
            $(img).attr('src', event.target.result);
            let img_preview = $(div).attr('class', 'group-img').append(img);
            
            $('.img_list').append(img_preview).find('img').css({
              'width' : def_settings.previewWidth,
              'height': def_settings.previewHeight,
            });


        });
        reader.readAsDataURL(file);
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
                errorBlock('Запрещенно загружать пустые файлы и папки!');
                $($file).value = "";
                return false;
              }
              send(v);

            });


            // let flag = false;
            // for(let i = 0; i < $file.length; i++ ) {
            //   let name = $file[i].name;
            //   console.log(Object.keys(arrFileFlag).includes(name))

            //   console.log(arrFileFlag.name)
            //   if($file[i].name == arrFileFlag[$file[i].name]) {
            //     if (arrFileFlag[$file[i].name] == 'true') {
            //       flag = true;
            //     } 
            //     else {
            //       flag = false;
            //       // break;
            //     }
            //   }
            // }
            

           
        }
        if(objFileFlag.length > 0 ) {
          let flag = false; 
          console.log($file)
          console.log(Object.getOwnPropertySymbols(objFileFlag).length)
          $.each(objFileFlag, function(k, v) {
            alert(v);
          })

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
              // setTimeout("alert('файлы загружены')", 5000);
              flag = true
              },
              error: function() {
                errorBlock('Ошибка при загрузке файлов');
                setTimeout(location.reload(), 3500);
                return false;
              }
            });

            
            if(flag) {
              isSetFile();               
                if(def_settings.preview == true) {   
                  $.each($file, function(i, v) {

                    let regexp = /image\/(jpeg|jpg|png|gif)/;

                    if(regexp.test(v.type)) {
                      preview(v);
                    }
                    else {
                      let $linkListFile = $('.files_list');
                      $($linkListFile).append('<div class="group-file">'+
                      '<img src="https://www.tangaroa.school.nz/wp-content/uploads/2019/07/wb-doc-icon.png" alt="">'+
                      '<p>'+ v.name +'</p>'+
                      '</div>');
                    }
                  })
                }
                else {
                  $('.preview').remove();
                  let $linkListFile = $('.files_list');
                  $.each($file, function(i, v) {
                    $($linkListFile).append('<div class="group-file">'+
                      '<img src="https://www.tangaroa.school.nz/wp-content/uploads/2019/07/wb-doc-icon.png" alt="">'+
                      '<p>'+ v.name +'</p>'+
                      '</div>');
                  })
                }

            }      

        }

      });



      

      
      // 
      // Количество загруженных файлов 
      //

      // let countFile = $($form).find('.inputfile')[0].files.length;
      
      
    })
    },

      // 
      // Количество загруженных файлов 
      //

      countFile: function () {
        return $(this).find('.inputfile')[0].files.length
      },

      //
      // Проверка на соответствие размера файлов 
      //

      sizeFile: function() {
        let file = $(this).find('.inputfile')[0].files;
        $.each(file, function(i, v) {
          if (v.size >= defaults.minCount && v.size <= defaults.maxCount) {
            return true;
          }
        })
      }

      //
      // Установка grag&drop
      //


      // dragClass: function() {
          
      // },

      // sizeFile : function (size) {
      //     let options = $(this).data('pluginFile');
      //     options.size = size;
      //     $(this).data('pluginFile', size);
      // },



      // minCount: function() {

      // },

      // maxCount: function() {

      // },

      // preview: function() {

      // },

      // previewWidth: function() {

      // },

      // previewHeight: function() {

      // },

      // removability: function() {

      // },

      // url: function() {

      // }
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

  // $('.pluginFile').pluginFile('createForm', 'img/cloud-computing.png', true, 'Выберите файл').pluginFile('sizeFile')
  $('.pluginFile').pluginFile();



