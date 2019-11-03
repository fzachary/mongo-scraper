module.exports = (router) => {

    router.get('/', (req, res) => {
        // Render the home page
        res.render('../views/index');
    });
    router.get('/saved', (req, res) => {
        //Render the saved page
        res.render('saved');
    });
    router.get('*', (req, res) => {
        res.render("404");
    });
}