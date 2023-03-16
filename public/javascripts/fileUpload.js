const links = document.querySelector('.links');
const ulLinks = document.querySelector('.ul-links');

links.addEventListener('click', () => {
ulLinks.classList.toggle('show');
});
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth : 100,
    imageResizeTargetHeight: 150
})
FilePond.parse(document.body)