#include <emscripten/emscripten.h>

// avoid c++ mangling of method name
extern "C" {
int EMSCRIPTEN_KEEPALIVE add(int a, int b) { return a + b; }
}
