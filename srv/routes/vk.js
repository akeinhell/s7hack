let express = require('express');
import eventBus, {EVENT_VK_MESSAGE} from '../../bot/events';
let router = express.Router();


/* GET users listing. */
router.post('/callback', function (req, res, next) {
    if (req.body.type === 'message_new') {
        eventBus.emit(EVENT_VK_MESSAGE, req.body.object);
    }
    res.send('ok');
});

module.exports = router;
