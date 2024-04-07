export const copyToClipboard = (text: string) => {
    // 创建一个临时的 textarea 元素
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    // 选择文本
    textarea.select();
    textarea.setSelectionRange(0, 99999); // 对于移动设备

    // 复制文本到剪贴板
    document.execCommand('copy');

    // 清理临时的 textarea 元素
    document.body.removeChild(textarea);
}
