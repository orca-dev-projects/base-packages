// const { CronJob } = require('cron');
//
// class CommonCronService {
//     constructor(time, payload) {
//         this.time = time;
//         this.payload = payload;
//         this.isEnabled = !!this.enabled;
//     }
//
//     run() {
//         this.cron = new CronJob(
//             this.time,
//             () => {
//                 if (this.isEnabled && process.env.ENABLE_CRON == 1)
//                     this.execute()
//             },
//             null,
//             true,
//             'Asia/Calcutta',
//         );
//     }
//
//     static get schedule() {
//         const self = this;
//         return (time, payload) => {
//             const _self = new self(time, payload);
//             _self.run()
//         }
//     }
// }
//
//
// exports = module.exports = CommonCronService;
