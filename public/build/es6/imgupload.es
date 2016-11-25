/**
 * Created by Administrator on 2016/10/25.
 */


!function($){
    class ImgUpload{
        constructor(element,options){
            this.element = element;
            this.setOptions(options)
        }
        setOptions(options){
            this.upButton = $(options.upButton);
            this.url = options.url;
            this.autoUpload  = false || options.autoUpload;
            this.dropArea = null || $(options.dropArea);
            this.filesList = [];
            this.maxSize = options.maxSize || (2 * 1024 * 1024);
            this.maxLength = options.maxLength || 10;

            this.beginUp = options.beginUp || function(){};
            this.filter = options.filter || function(files){ return files;};
            this.prevImg = options.prevImg || function(){};
            this.progress = options.progress || function(){};
            this.compeleted = options.compeleted || function(){};



            this.init();
        }

        fileAdded (e){
            let self = this;
            e.stopPropagation()
            e.preventDefault();
            this.dropArea.removeClass('active');
            let files = e.target.files || e.originalEvent.dataTransfer.files;
            //当前新增过滤后文件
            let filterFiles = self.filter(files);
            //上传队列
            self.filesList = self.filesList.concat(filterFiles);
            //当前新增预览
            let prevFilesSrc = [];
            $(filterFiles).each(function(index,file){
                //预览图队列
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    prevFilesSrc.push(e.target.result);
                    if(index == filterFiles.length -1) {
                        self.prevImg(prevFilesSrc);
                    }
                }
            });
        }

        upload(){
            if(this.filesList.length == 0){
                alert('请先选择需要上传的文件！');
                return
            }
            let self = this;
            let formData = new FormData();
            $(this.filesList).each(function(index,item){
                formData.append('file'+index,item)
            });
            self.beginUp();
            $.ajax({
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress" , function(e){
                        self.progress(e);
                    }, false);
                    return xhr;
                },
                url : this.url,
                type : 'POST',
                data : formData,
                processData: false,
                contentType: false,
                success : function(msg){
                    self.filesList.length = 0;
                    self.compeleted(msg);
                }
            });
        }

        dragEnter(){
            this.dropArea.addClass('active');
        }

        dragLeave(){
            this.dropArea.removeClass('active');
        }

        init(){
            //初始化事件

            //fileInput
            this.element.on('change',$.proxy(this.fileAdded,this));

            //上传
            if(this.upButton && this.autoUpload == false){
                this.upButton.on('click',$.proxy(this.upload,this));
            }

            //拖拽
            if (this.dropArea) {
                this.dropArea.on("dragenter", $.proxy(this.dragEnter,this));
                this.dropArea.on("dragleave", $.proxy(this.dragLeave,this));
                this.dropArea.on("drop", $.proxy(this.fileAdded,this));
            }

            //阻止浏览器默认行。
            $(document).on({
                dragleave:function(e){e.preventDefault();},
                drop:function(e){ e.preventDefault();},
                dragenter:function(e){ e.preventDefault();},
                dragover:function(e){e.preventDefault();}
            });
        }
    }

    $.fn.imgupload = function(options,cb) {
        this.each(function(){
            var el = $(this);
            if(el.data('imgupload')){
                el.data('imgupload').remove()
            }
            el.data('imgupload', new ImgUpload(el, options, cb));
        })
        return this
    }
}($);








