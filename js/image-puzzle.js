var timerFunction;

var imagePuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),

    startGame: function(gridSize) {
        this.setImage(gridSize);
        $('#playPanel').show();
        $('#sortable').randomize();
        this.enableSwapping('#sortable li');
        this.stepCount = 0;
        this.startTime = new Date().getTime();
        this.tick();
    },

    tick: function() {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        $('#timerPanel').text(elapsedTime);
        timerFunction = setTimeout(imagePuzzle.tick, 1000);
    },

    enableSwapping: function(elem) {
        $(elem).draggable({
            revert: "invalid",
            helper: "clone"
        });

        $(elem).droppable({
            drop: function(event, ui) {
                var $dragElem = $(ui.draggable).clone().replaceAll(this);
                $(this).replaceAll(ui.draggable);

                var currentList = $('#sortable > li').map(function(i, el) { return $(el).attr('data-value'); }).get();
                if (isSorted(currentList)) {
                    clearTimeout(timerFunction);
                    $('#actualImageBox').empty().html($('#gameOver').html());
                } else {
                    imagePuzzle.stepCount++;
                    $('.stepCount').text(imagePuzzle.stepCount);
                    $('.timeCount').text(parseInt((new Date().getTime() - imagePuzzle.startTime) / 1000, 10));
                }

                imagePuzzle.enableSwapping(this);
                imagePuzzle.enableSwapping($dragElem);
            }
        });
    },

    setImage: function(gridSize) {
        var percentage = 100 / (gridSize - 1);
        var image = {
            src: 'images/lotus-temple.jpg', // 使用你想要的图片路径
            title: '武田人血蛋白包装' // 使用你想要的图片标题
        };

        $('#imgTitle').html(image.title);
        $('#actualImage').attr('src', image.src);
        $('#sortable').empty();

        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';
            var li = $('<li class="item" data-value="' + i + '"></li>').css({
                'background-image': 'url(' + image.src + ')',
                'background-size': (gridSize * 100) + '%',
                'background-position': xpos + ' ' + ypos,
                'width': '80px', // 在手机上适配
                'height': '80px' // 在手机上适配
            });
            $('#sortable').append(li);
        }

        $('#sortable').randomize();
    }
};

function isSorted(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] != i) return false;
    }
    return true;
}



$.fn.randomize = function(selector) {
    var $elems = selector ? $(this).find(selector) : $(this).children(),
        $parents = $elems.parent();

    $parents.each(function() {
        $(this).children(selector).sort(function() {
            return Math.round(Math.random()) - 0.5;
        }).detach().appendTo(this);
    });
    return this;
};

$(function() {
    var gridSize = 4; // 固定拼图难度为4x4
    imagePuzzle.startGame(gridSize);

    $('#btnReplay').on('click', function() {
        location.reload();
    });
});

function rules() {
    alert('Rearrange the image parts to correctly form the picture.\nThe number of steps taken will be counted.');
}

function about() {
    alert('Developed by Anurag Gandhi.\nHe can be contacted at: soft.gandhi@gmail.com');
}
// 初始化拖拽功能
$("#sortable").sortable({
    start: function(event, ui) {
        ui.item.data('start_pos', ui.item.index());
    },
    update: function(event, ui) {
        var start_pos = ui.item.data('start_pos');
        var end_pos = ui.item.index();
        if (start_pos !== end_pos) {
            // 更新步骤计数器
            var stepCount = parseInt($(".stepCount").text(), 10) + 1;
            $(".stepCount").text(stepCount);
        }
    }
});

// 确保拖拽功能在移动设备上也能正常工作
$("#sortable").sortable({
    handle: 'li',
    cancel: ''
}).disableSelection();
// location.reload();