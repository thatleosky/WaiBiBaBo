// 定义加密映射
const binMap = { 0b00: '歪', 0b01: '比', 0b10: '巴', 0b11: '卜' };
const reverseMap = { '歪': 0b00, '比': 0b01, '巴': 0b10, '卜': 0b11 };

// 加密函数
async function waibiEncode(text) {
  const buffer = new TextEncoder().encode(text);
  return Array.from(buffer).flatMap(byte => [
    binMap[byte >> 6],
    binMap[(byte >> 4) & 0b11],
    binMap[(byte >> 2) & 0b11],
    binMap[byte & 0b11]
  ]).join('');
}

// 解密函数
async function waibiDecode(cipher) {
  if (cipher.length % 4 !== 0) throw new Error('密文长度错误');
  const bytes = [];
  for (let i = 0; i < cipher.length; i += 4) {
    const bits = cipher.slice(i, i + 4).split('').map(c => reverseMap[c]);
    bytes.push((bits[0] << 6) | (bits[1] << 4) | (bits[2] << 2) | bits[3]);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// 绑定事件
$(document).ready(() => {
  $('#btn-encode').click(async () => {
    try {
      $('#waibi').val(await waibiEncode($('#text').val()));
    } catch (e) {
      alert(`加密失败: ${e.message}`);
    }
  });

  $('#btn-decode').click(async () => {
    try {
      $('#text').val(await waibiDecode($('#waibi').val()));
    } catch (e) {
      alert(`解密失败: ${e.message}`);
    }
  });

  // 复制功能
  $('#copy-text').click(() => {
    navigator.clipboard.writeText($('#text').val());
    alert('已复制明文！');
  });

  $('#copy-waibi').click(() => {
    navigator.clipboard.writeText($('#waibi').val());
    alert('已复制密文！');
  });

  // 弹窗逻辑
  $('#show-spec-btn').click(() => $('#myModal').show());
  $('.close, #myModal').click(() => $('#myModal').hide());
});
