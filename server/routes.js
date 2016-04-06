import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/',(req, res) => {
  res.render('index');
});

router.get('/version', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.resolve(__dirname, 'VERSION'));
});

// Facebook sends a POST request when loading the iframe for the first time
// that's why it needs to be caught too.
function fbCanvas(req, res) {
  res.render('canvas/fb');
}
router.get('/canvas/fb', fbCanvas);
router.post('/canvas/fb', fbCanvas);

export default router;
