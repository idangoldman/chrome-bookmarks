function bookmarksToYAML(bookmarkTree) {
  let yaml = '';

  function processBookmarks(bookmarkNode, indent) {
    // console.log('bookmarkNode:', bookmarkNode);
    if (bookmarkNode.children) {
      yaml += `${indent}- folder: "${bookmarkNode.title}"\n`;
      yaml += `${indent}  links:\n`;

      bookmarkNode.children.forEach((child) => processBookmarks(child, `${indent}    `));

    } else {
      yaml += `${indent}- title: "${bookmarkNode.title}"\n`;
      yaml += `${indent}  url: "${bookmarkNode.url}"\n`;
    }
  }

  bookmarkTree.forEach((root) => processBookmarks(root, ''));

  return yaml;
}

chrome.bookmarks.getTree((bookmarkTree = []) => {
  bookmarkTree = bookmarkTree[0]?.children || [];

  const yamlData = bookmarksToYAML(bookmarkTree);
  console.log(yamlData);
  chrome.downloads.download({
    // url: URL.createObjectURL(new Blob([yamlData], { type: 'text/yaml;charset=utf-8' })),
    filename: 'bookmarks.yaml',
    conflictAction: 'overwrite',
    saveAs: false,
    url: 'data:application/yaml;base64,' + btoa(new Blob([yamlData], { type: 'text/yaml;charset=utf-8' })),
  });
});