/*
*  instructions ：uploadImg
*  date : 2015-06-17
*  author : 张文书
*  Last Modified 
*  By 张文书
*/

/*
调用说明：    
        
var upload = new window.uploadImg();
upload.init({
fileAreaId:"aa",//显示file控件的区域id
showNameAreaId: "bb",  //显示文件名称容器id         
maxUploadCount: 5    //最大上传数量
});
*/


(function () {

    var uploadParam = {
        inputFileCount: 0,  //记录file个数
        inputFilePrefix: "zwsuploadfile_",  //file前缀
        InputFileAreaIdFix: "zwsSpanArea_"  //定义input file控件的区域id前缀
    };

    var uploadImg = function () {
        this.defaultParams = {
            fileAreaId: "",      //显示input file控件的区域id
            showNameAreaId: "",  //显示文件名称容器id
            maxUploadCount: 5    //最大上传数量
        };
    };

    uploadImg.prototype = {

        constructor: uploadImg,

        init: function (params) {
            this.options = commonOp.coverObject(this.defaultParams, params);

            this._init();
        },

        _init: function () {
            this.createInputFileArea();
            this.createInputFile();
        },

        //创建input file
        createInputFile: function () {

            var spanId = uploadParam.InputFileAreaIdFix + this.options.fileAreaId;

            uploadParam.inputFileCount++;
            var fileEl = document.createElement("input");
            fileEl.name = uploadParam.inputFilePrefix + uploadParam.inputFileCount;
            fileEl.id = uploadParam.inputFilePrefix + uploadParam.inputFileCount;
            fileEl.type = "file";
            fileEl.className = "uploadfile";

            var handleEvent = commonOp.delegate(this._handleOnchange, this, [{ fileEl: fileEl}]);
            //注册change事件
            fileEl.onchange = handleEvent;

            //创建input file
            document.getElementById(spanId).appendChild(fileEl);
        },

        createInputFileArea: function () {
            var spanId = uploadParam.InputFileAreaIdFix + this.options.fileAreaId;

            var spanEl = document.createElement("span");
            spanEl.id = spanId;
            spanEl.className = "spanarea";
            document.getElementById(this.options.fileAreaId).appendChild(spanEl);

            var inputBtnEl = document.createElement("input");
            inputBtnEl.value = "添加附件";
            inputBtnEl.className = "btnfile";
            inputBtnEl.type = "button";
            document.getElementById(spanId).appendChild(inputBtnEl);

        },

        //判断该图片文件是否已经存在与上传队列中
        isExistsPic: function (name) {
            var spanList = document.getElementById(this.options.showNameAreaId).getElementsByTagName("span");
            var isExist = false;
            for (var i = 0; i < spanList.length; i++) {
                if (name.trim() == spanList[i].getAttribute("attrName").trim()) {
                    isExist = true;
                }
            }
            return isExist;
        },

        //判断上传文件是否超过上限
        isOverMaxUploadCount: function () {
            var spanList = document.getElementById(this.options.showNameAreaId).getElementsByTagName("span");
            if (spanList.length >= this.options.maxUploadCount) {
                return true;
            }
            return false;
        },

        //获取文件名称
        getFileName: function (path) {

            var pos1 = path.lastIndexOf('/');
            var pos2 = path.lastIndexOf('\\');
            var pos = Math.max(pos1, pos2);
            if (pos < 0) {
                return path;
            }
            else {
                return path.substring(pos + 1);
            }
        },

        /****************************************（事件句柄 begin）***************************************/

        _handleOnchange: function (params) {

            this.createInputFile();

            var fileEl = params.fileEl;
            var name = this.getFileName(fileEl.value);
            var spanId = uploadParam.InputFileAreaIdFix + this.options.fileAreaId;
            if (!name.IsPic()) {
                alert("选择的图片文件类型出错，请重新选择");
                document.getElementById(spanId).removeChild(fileEl);
                return;
            }
            if (this.isExistsPic(name)) {
                alert("该文件已经被选中，请重新选择！");
                document.getElementById(spanId).removeChild(fileEl);
                return;
            }
            if (this.isOverMaxUploadCount()) {
                alert("已经达到上传上限！");
                document.getElementById(spanId).removeChild(fileEl);
                return;
            }
            
            var childInput = document.createElement("input");
            childInput.type = "checkbox";
            childInput.checked = "checked";
            childInput.style.marginLeft = "20px";

            var handleEvent = commonOp.delegate(this._handleCheckBoxClick, this, [{ obj: childInput, fileElObj: fileEl}]);
            childInput.onclick = handleEvent;

            document.getElementById(this.options.showNameAreaId).appendChild(childInput);
            childInput.checked = "checked";
            
            var childSpan = document.createElement("span");
            childSpan.setAttribute("attrName", name);
            childSpan.style.width = "auto";
            childSpan.style.marginLeft = "5px";
            childSpan.innerHTML = name;
            document.getElementById(this.options.showNameAreaId).appendChild(childSpan);

            var childBr = document.createElement("br");
            document.getElementById(this.options.showNameAreaId).appendChild(childBr);
        },

        _handleCheckBoxClick: function (params) {
            var obj = params.obj;
            var fileElObj = params.fileElObj;
            if (obj.checked) {
                fileElObj.removeAttribute("disabled");
            }
            else {
                fileElObj.disabled = "disabled";
            }
        }

        /****************************************（事件句柄 end）***************************************/
    };


    window.uploadImg = uploadImg;

})();