remark.highlighter.engine = hljs;
remark.create({
  sourceUrl: 'slides.md',
  navigation: {
    scroll: false,
    touch: false,
    click: false
  },
  ratio: '4:3',
  slideNumberFormat: '',
  highlightStyle: 'monokai',
});
