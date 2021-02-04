# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).


## BackLog
### Question Page
1. question page to combine create and Edit form
2. Edit Question modal does not refresh when exit
3. after editing, need to click on question twice for the detail to refresh
4. last triggered data is not currently present(using last updated instead)
5. keywords api not yet present

### Flows Page
1. response area for quick button can be refactored
2. implement deletion of quick reply/buttons
3. draggable or movable buttons/templates
4. generic template on delete tab reload
