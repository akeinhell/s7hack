let express = require('express');
import logger from '../../bot/logger';
import eventBus, {EVENT_VK_MESSAGE} from '../../bot/events';
let router = express.Router();


/* GET users listing. */
router.post('/callback', function (req, res, next) {
    let type = req.body.type;
    let response = 'incorrect';
    switch (type) {
        case 'message_new':
            response = 'message_new.ok';
            eventBus.emit(EVENT_VK_MESSAGE, req.body.object);
            break;
        case 'confirmation':
            response = 'ee87901e';
    }
    return res.send(response);
});

module.exports = router;
