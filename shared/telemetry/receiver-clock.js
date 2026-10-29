// The epoch comes from the receiver. Device wall-clock changes never enter it.
export function createReceiverClock(anchor, started=performance.now()) {
  if(!anchor || typeof anchor.id!=='string' || !Number.isSafeInteger(anchor.at))return null;
  let epoch=anchor.at,origin=started,last=anchor.at;
  return {
    stamp(){
      last=Math.max(last,Math.round(epoch+performance.now()-origin));
      const elapsed_ms=last-anchor.at;
      return {at:anchor.at+elapsed_ms,time:{clock_id:anchor.id,elapsed_ms}};
    },
    now(){return this.stamp().at;},
    sync(serverAt,requested,received){
      if(!Number.isSafeInteger(serverAt)||serverAt<anchor.at)return;
      // Midpoint bounds ordinary transport error; emitted records remain immutable.
      epoch=serverAt;origin=(requested+received)/2;
    }
  };
}
