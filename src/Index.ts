const {app, start} = require('./App')
const port = 3001;

start()
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});