import pkgUp from 'pkg-up';
const { dirname, join } = require('path');

export default () => ({
  visitor: {
    ObjectProperty(path, state) {
      const filename = state.file.opts.filename;
      const node = path.node;
      if (
        node.key.name === 'icon' &&
        node.value &&
        node.value.value &&
        node.value.value.endsWith('.svg')
      ) {

        const icon = node.value.value;

        const pkgPath = pkgUp.sync({ cwd: dirname(filename) });
        const pkgDir = dirname(pkgUp.sync({ cwd: dirname(filename) }));
        const pkg = require(pkgPath);

        node.value.value =
          icon.startsWith('/') || icon.startsWith('.')
            ? join(dirname(filename), icon)
            : icon;

        if (node.value.value.startsWith(pkgDir)) {
          node.value.value = node.value.value.replace(pkgDir, pkg.name);
        }

      }
    }
  }
});
