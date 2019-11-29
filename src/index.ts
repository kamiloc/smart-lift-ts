import $ from "jQuery";
let current = 0;

$(document).ready(function() {
  $("#floorSelect li").click(function() {
    let floor = parseInt($(this).data("floor"), 10),
      height = floor * 20,
      animate = Math.abs(current - floor) * 1000;

    if (floor === current) return;

    $("#rightDoor").removeClass("active-right");
    $("#leftDoor").removeClass("active-left");

    setTimeout(function() {
      $("#elevatorContainer").css("transition", "all " + animate + "ms linear");
      $("#elevatorContainer").css("bottom", height + "%");
      current = floor;

      setTimeout(function() {
        $("#rightDoor").addClass("active-right");
        $("#leftDoor").addClass("active-left");
      }, animate);
    }, 300);
  });
});
