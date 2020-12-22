import $ from "jquery";
import "jquery-mask-plugin";

$('.formElement__input[name="user-masks"]').mask("dD.mM.THDY", {
  translation: {
    d: { pattern: /[0-3]/, recursive: true },
    D: { pattern: /[0-9]/, recursive: true },
    m: { pattern: /[0-1]/, recursive: true },
    M: { pattern: /[0-9]/, recursive: true },
    T: { pattern: /[1-2]/, recursive: true },
    H: { pattern: /[9,0]/, recursive: true },
    D: { pattern: /[0-9]/, recursive: true },
    Y: { pattern: /[0-9]/, recursive: true },
  },
});
