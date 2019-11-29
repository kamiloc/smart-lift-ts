// @ts-ignore
const $jq = window.$;

class Main {
  private currentFloor: number = 0;

  private onSelectFloor(e: MouseEvent) {
    let floor: number = parseInt($jq(e.target).data("floor"), 10),
      height: number = floor * 20,
      animate: number = Math.abs(this.currentFloor - floor) * 1000;

    if (floor === this.currentFloor) return;

    $jq("#rightDoor").removeClass("active-right");
    $jq("#leftDoor").removeClass("active-left");

    setTimeout(
      function() {
        $jq("#elevatorContainer").css("transition", "all " + animate + "ms linear");
        $jq("#elevatorContainer").css("bottom", height + "%");
        this.currentFloor = floor;

        setTimeout(function() {
          $jq("#rightDoor").addClass("active-right");
          $jq("#leftDoor").addClass("active-left");
        }, animate);
      }.bind(this),
      300
    );
  }

  public init() {
    $jq("#floorSelect li").click(this.onSelectFloor.bind(this));
  }
}

$jq(document).ready(new Main().init());
