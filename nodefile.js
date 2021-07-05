const fs = require('fs').promises;

function copyFile(src, dist) {
  fs.copyFile(src, dist, error => {
    if (error) {
      console.error('Copy file error: ', error);
    }
  });
}

copyFile('./Scrollbar.less', './build/Scrollbar/Scrollbar.less');
