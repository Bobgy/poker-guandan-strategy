Module["asm"] =  (/** @suppress {uselessCode} */ function(global, env, buffer) {
'almost asm';


  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);

  var DYNAMICTOP_PTR=env.DYNAMICTOP_PTR|0;
  var tempDoublePtr=env.tempDoublePtr|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = global.NaN, inf = global.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntS = 0, tempValue = 0, tempDouble = 0.0;

  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var Math_min=global.Math.min;
  var Math_max=global.Math.max;
  var Math_clz32=global.Math.clz32;
  var abort=env.abort;
  var assert=env.assert;
  var setTempRet0=env.setTempRet0;
  var getTempRet0=env.getTempRet0;
  var abortOnCannotGrowMemory=env.abortOnCannotGrowMemory;
  var abortStackOverflow=env.abortStackOverflow;
  var nullFunc_i=env.nullFunc_i;
  var nullFunc_ii=env.nullFunc_ii;
  var nullFunc_iii=env.nullFunc_iii;
  var nullFunc_iiii=env.nullFunc_iiii;
  var nullFunc_iiiii=env.nullFunc_iiiii;
  var nullFunc_v=env.nullFunc_v;
  var nullFunc_vi=env.nullFunc_vi;
  var nullFunc_vii=env.nullFunc_vii;
  var nullFunc_viii=env.nullFunc_viii;
  var nullFunc_viiii=env.nullFunc_viiii;
  var nullFunc_viiiii=env.nullFunc_viiiii;
  var nullFunc_viiiiii=env.nullFunc_viiiiii;
  var ClassHandle=env.ClassHandle;
  var ClassHandle_clone=env.ClassHandle_clone;
  var ClassHandle_delete=env.ClassHandle_delete;
  var ClassHandle_deleteLater=env.ClassHandle_deleteLater;
  var ClassHandle_isAliasOf=env.ClassHandle_isAliasOf;
  var ClassHandle_isDeleted=env.ClassHandle_isDeleted;
  var RegisteredClass=env.RegisteredClass;
  var RegisteredPointer=env.RegisteredPointer;
  var RegisteredPointer_deleteObject=env.RegisteredPointer_deleteObject;
  var RegisteredPointer_destructor=env.RegisteredPointer_destructor;
  var RegisteredPointer_fromWireType=env.RegisteredPointer_fromWireType;
  var RegisteredPointer_getPointee=env.RegisteredPointer_getPointee;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var ___assert_fail=env.___assert_fail;
  var ___cxa_allocate_exception=env.___cxa_allocate_exception;
  var ___cxa_begin_catch=env.___cxa_begin_catch;
  var ___cxa_find_matching_catch=env.___cxa_find_matching_catch;
  var ___cxa_free_exception=env.___cxa_free_exception;
  var ___cxa_throw=env.___cxa_throw;
  var ___gxx_personality_v0=env.___gxx_personality_v0;
  var ___lock=env.___lock;
  var ___resumeException=env.___resumeException;
  var ___setErrNo=env.___setErrNo;
  var ___syscall140=env.___syscall140;
  var ___syscall146=env.___syscall146;
  var ___syscall54=env.___syscall54;
  var ___syscall6=env.___syscall6;
  var ___unlock=env.___unlock;
  var __embind_finalize_value_object=env.__embind_finalize_value_object;
  var __embind_register_bool=env.__embind_register_bool;
  var __embind_register_class=env.__embind_register_class;
  var __embind_register_class_constructor=env.__embind_register_class_constructor;
  var __embind_register_class_function=env.__embind_register_class_function;
  var __embind_register_emval=env.__embind_register_emval;
  var __embind_register_float=env.__embind_register_float;
  var __embind_register_function=env.__embind_register_function;
  var __embind_register_integer=env.__embind_register_integer;
  var __embind_register_memory_view=env.__embind_register_memory_view;
  var __embind_register_std_string=env.__embind_register_std_string;
  var __embind_register_std_wstring=env.__embind_register_std_wstring;
  var __embind_register_value_object=env.__embind_register_value_object;
  var __embind_register_value_object_field=env.__embind_register_value_object_field;
  var __embind_register_void=env.__embind_register_void;
  var __emval_decref=env.__emval_decref;
  var __emval_incref=env.__emval_incref;
  var __emval_register=env.__emval_register;
  var __emval_take_value=env.__emval_take_value;
  var _abort=env._abort;
  var _embind_repr=env._embind_repr;
  var _emscripten_get_heap_size=env._emscripten_get_heap_size;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var _emscripten_resize_heap=env._emscripten_resize_heap;
  var _pthread_getspecific=env._pthread_getspecific;
  var _pthread_key_create=env._pthread_key_create;
  var _pthread_once=env._pthread_once;
  var _pthread_setspecific=env._pthread_setspecific;
  var constNoSmartPtrRawPointerToWireType=env.constNoSmartPtrRawPointerToWireType;
  var count_emval_handles=env.count_emval_handles;
  var craftInvokerFunction=env.craftInvokerFunction;
  var createNamedFunction=env.createNamedFunction;
  var downcastPointer=env.downcastPointer;
  var embind__requireFunction=env.embind__requireFunction;
  var embind_init_charCodes=env.embind_init_charCodes;
  var ensureOverloadTable=env.ensureOverloadTable;
  var exposePublicSymbol=env.exposePublicSymbol;
  var extendError=env.extendError;
  var floatReadValueFromPointer=env.floatReadValueFromPointer;
  var flushPendingDeletes=env.flushPendingDeletes;
  var flush_NO_FILESYSTEM=env.flush_NO_FILESYSTEM;
  var genericPointerToWireType=env.genericPointerToWireType;
  var getBasestPointer=env.getBasestPointer;
  var getInheritedInstance=env.getInheritedInstance;
  var getInheritedInstanceCount=env.getInheritedInstanceCount;
  var getLiveInheritedInstances=env.getLiveInheritedInstances;
  var getShiftFromSize=env.getShiftFromSize;
  var getTypeName=env.getTypeName;
  var get_first_emval=env.get_first_emval;
  var heap32VectorToArray=env.heap32VectorToArray;
  var init_ClassHandle=env.init_ClassHandle;
  var init_RegisteredPointer=env.init_RegisteredPointer;
  var init_embind=env.init_embind;
  var init_emval=env.init_emval;
  var integerReadValueFromPointer=env.integerReadValueFromPointer;
  var makeClassHandle=env.makeClassHandle;
  var makeLegalFunctionName=env.makeLegalFunctionName;
  var new_=env.new_;
  var nonConstNoSmartPtrRawPointerToWireType=env.nonConstNoSmartPtrRawPointerToWireType;
  var readLatin1String=env.readLatin1String;
  var registerType=env.registerType;
  var replacePublicSymbol=env.replacePublicSymbol;
  var requireRegisteredType=env.requireRegisteredType;
  var runDestructor=env.runDestructor;
  var runDestructors=env.runDestructors;
  var setDelayFunction=env.setDelayFunction;
  var shallowCopyInternalPointer=env.shallowCopyInternalPointer;
  var simpleReadValueFromPointer=env.simpleReadValueFromPointer;
  var throwBindingError=env.throwBindingError;
  var throwInstanceAlreadyDeleted=env.throwInstanceAlreadyDeleted;
  var throwInternalError=env.throwInternalError;
  var throwUnboundTypeError=env.throwUnboundTypeError;
  var upcastPointer=env.upcastPointer;
  var whenDependentTypesAreResolved=env.whenDependentTypesAreResolved;
  var STACKTOP = 8560;
  var STACK_MAX = 5251440;
  var tempFloat = 0.0;

// EMSCRIPTEN_START_FUNCS

function stackAlloc(size) {
  size = size|0;
  var ret = 0;
  ret = STACKTOP;
  STACKTOP = (STACKTOP + size)|0;
  STACKTOP = (STACKTOP + 15)&-16;
    if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(size|0);

  return ret|0;
}
function stackSave() {
  return STACKTOP|0;
}
function stackRestore(top) {
  top = top|0;
  STACKTOP = top;
}
function establishStackSpace(stackBase, stackMax) {
  stackBase = stackBase|0;
  stackMax = stackMax|0;
  STACKTOP = stackBase;
  STACK_MAX = stackMax;
}
function setThrew(threw, value) {
  threw = threw|0;
  value = value|0;
  if ((__THREW__|0) == 0) {
    __THREW__ = threw;
    threwValue = value;
  }
}

function ___cxx_global_var_init() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $4 = 7664;
 $5 = 3752;
 $6 = $4;
 $3 = $6;
 $7 = $3;
 $2 = $7;
 $8 = $2;
 ;HEAP32[$8>>2]=0|0;HEAP32[$8+4>>2]=0|0;HEAP32[$8+8>>2]=0|0;
 $1 = $7;
 $9 = $1;
 $0 = $9;
 $10 = $5;
 $11 = $5;
 $12 = (__ZNSt3__211char_traitsIcE6lengthEPKc($11)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($6,$10,$12);
 STACKTOP = sp;return;
}
function __Z23calculateMinHandsSimpleiiiii($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0;
 var $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 272|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(272|0);
 $10 = sp + 40|0;
 $13 = sp + 265|0;
 $19 = sp + 32|0;
 $22 = sp + 264|0;
 $28 = sp + 24|0;
 $31 = sp + 263|0;
 $37 = sp + 16|0;
 $40 = sp + 262|0;
 $46 = sp + 8|0;
 $49 = sp + 261|0;
 $55 = sp;
 $58 = sp + 260|0;
 $61 = sp + 80|0;
 $62 = sp + 76|0;
 $65 = sp + 64|0;
 $66 = sp + 60|0;
 $67 = sp + 56|0;
 $68 = sp + 52|0;
 $69 = sp + 48|0;
 $70 = sp + 44|0;
 $60 = $0;
 HEAP32[$61>>2] = $1;
 HEAP32[$62>>2] = $2;
 $63 = $3;
 $64 = $4;
 $71 = $64;
 $72 = ($71|0)<=(0);
 if ($72) {
  $73 = $60;
  $56 = $61;
  $57 = $62;
  $74 = $56;
  $75 = $57;
  ;HEAP8[$55>>0]=HEAP8[$58>>0]|0;
  $53 = $74;
  $54 = $75;
  $76 = $53;
  $77 = $54;
  $50 = $55;
  $51 = $76;
  $52 = $77;
  $78 = $51;
  $79 = HEAP32[$78>>2]|0;
  $80 = $52;
  $81 = HEAP32[$80>>2]|0;
  $82 = ($79|0)<($81|0);
  $83 = $54;
  $84 = $53;
  $85 = $82 ? $83 : $84;
  $86 = HEAP32[$85>>2]|0;
  $87 = (($73) + ($86))|0;
  $59 = $87;
  $204 = $59;
  STACKTOP = sp;return ($204|0);
 }
 HEAP32[$65>>2] = 100000;
 $88 = $60;
 $89 = ($88|0)>(0);
 if ($89) {
  $90 = $60;
  $91 = (($90) - 1)|0;
  $92 = HEAP32[$61>>2]|0;
  $93 = (($92) + 1)|0;
  $94 = HEAP32[$62>>2]|0;
  $95 = $63;
  $96 = $64;
  $97 = (($96) - 1)|0;
  $98 = (__Z23calculateMinHandsSimpleiiiii($91,$93,$94,$95,$97)|0);
  HEAP32[$66>>2] = $98;
  $38 = $65;
  $39 = $66;
  $99 = $38;
  $100 = $39;
  ;HEAP8[$37>>0]=HEAP8[$40>>0]|0;
  $35 = $99;
  $36 = $100;
  $101 = $36;
  $102 = $35;
  $32 = $37;
  $33 = $101;
  $34 = $102;
  $103 = $33;
  $104 = HEAP32[$103>>2]|0;
  $105 = $34;
  $106 = HEAP32[$105>>2]|0;
  $107 = ($104|0)<($106|0);
  $108 = $36;
  $109 = $35;
  $110 = $107 ? $108 : $109;
  $111 = HEAP32[$110>>2]|0;
  HEAP32[$65>>2] = $111;
 }
 $112 = HEAP32[$61>>2]|0;
 $113 = ($112|0)>(0);
 if ($113) {
  $114 = $60;
  $115 = HEAP32[$61>>2]|0;
  $116 = (($115) - 1)|0;
  $117 = HEAP32[$62>>2]|0;
  $118 = (($117) + 1)|0;
  $119 = $63;
  $120 = $64;
  $121 = (($120) - 1)|0;
  $122 = (__Z23calculateMinHandsSimpleiiiii($114,$116,$118,$119,$121)|0);
  HEAP32[$67>>2] = $122;
  $20 = $65;
  $21 = $67;
  $123 = $20;
  $124 = $21;
  ;HEAP8[$19>>0]=HEAP8[$22>>0]|0;
  $17 = $123;
  $18 = $124;
  $125 = $18;
  $126 = $17;
  $14 = $19;
  $15 = $125;
  $16 = $126;
  $127 = $15;
  $128 = HEAP32[$127>>2]|0;
  $129 = $16;
  $130 = HEAP32[$129>>2]|0;
  $131 = ($128|0)<($130|0);
  $132 = $18;
  $133 = $17;
  $134 = $131 ? $132 : $133;
  $135 = HEAP32[$134>>2]|0;
  HEAP32[$65>>2] = $135;
 }
 $136 = HEAP32[$62>>2]|0;
 $137 = ($136|0)>(0);
 if ($137) {
  $138 = $60;
  $139 = HEAP32[$61>>2]|0;
  $140 = HEAP32[$62>>2]|0;
  $141 = (($140) - 1)|0;
  $142 = $63;
  $143 = (($142) + 1)|0;
  $144 = $64;
  $145 = (($144) - 1)|0;
  $146 = (__Z23calculateMinHandsSimpleiiiii($138,$139,$141,$143,$145)|0);
  HEAP32[$68>>2] = $146;
  $11 = $65;
  $12 = $68;
  $147 = $11;
  $148 = $12;
  ;HEAP8[$10>>0]=HEAP8[$13>>0]|0;
  $8 = $147;
  $9 = $148;
  $149 = $9;
  $150 = $8;
  $5 = $10;
  $6 = $149;
  $7 = $150;
  $151 = $6;
  $152 = HEAP32[$151>>2]|0;
  $153 = $7;
  $154 = HEAP32[$153>>2]|0;
  $155 = ($152|0)<($154|0);
  $156 = $9;
  $157 = $8;
  $158 = $155 ? $156 : $157;
  $159 = HEAP32[$158>>2]|0;
  HEAP32[$65>>2] = $159;
 }
 $160 = $63;
 $161 = ($160|0)>(0);
 if ($161) {
  $162 = $60;
  $163 = HEAP32[$61>>2]|0;
  $164 = HEAP32[$62>>2]|0;
  $165 = $63;
  $166 = $64;
  $167 = (($166) - 1)|0;
  $168 = (__Z23calculateMinHandsSimpleiiiii($162,$163,$164,$165,$167)|0);
  HEAP32[$69>>2] = $168;
  $29 = $65;
  $30 = $69;
  $169 = $29;
  $170 = $30;
  ;HEAP8[$28>>0]=HEAP8[$31>>0]|0;
  $26 = $169;
  $27 = $170;
  $171 = $27;
  $172 = $26;
  $23 = $28;
  $24 = $171;
  $25 = $172;
  $173 = $24;
  $174 = HEAP32[$173>>2]|0;
  $175 = $25;
  $176 = HEAP32[$175>>2]|0;
  $177 = ($174|0)<($176|0);
  $178 = $27;
  $179 = $26;
  $180 = $177 ? $178 : $179;
  $181 = HEAP32[$180>>2]|0;
  HEAP32[$65>>2] = $181;
 }
 $182 = $60;
 $183 = (($182) + 1)|0;
 $184 = HEAP32[$61>>2]|0;
 $185 = HEAP32[$62>>2]|0;
 $186 = $63;
 $187 = $64;
 $188 = (($187) - 1)|0;
 $189 = (__Z23calculateMinHandsSimpleiiiii($183,$184,$185,$186,$188)|0);
 HEAP32[$70>>2] = $189;
 $47 = $65;
 $48 = $70;
 $190 = $47;
 $191 = $48;
 ;HEAP8[$46>>0]=HEAP8[$49>>0]|0;
 $44 = $190;
 $45 = $191;
 $192 = $45;
 $193 = $44;
 $41 = $46;
 $42 = $192;
 $43 = $193;
 $194 = $42;
 $195 = HEAP32[$194>>2]|0;
 $196 = $43;
 $197 = HEAP32[$196>>2]|0;
 $198 = ($195|0)<($197|0);
 $199 = $45;
 $200 = $44;
 $201 = $198 ? $199 : $200;
 $202 = HEAP32[$201>>2]|0;
 HEAP32[$65>>2] = $202;
 $203 = HEAP32[$65>>2]|0;
 $59 = $203;
 $204 = $59;
 STACKTOP = sp;return ($204|0);
}
function __Z5countNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEi($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0;
 var $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 320|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(320|0);
 $3 = sp + 32|0;
 $11 = sp + 276|0;
 $13 = sp + 268|0;
 $15 = sp + 260|0;
 $52 = sp + 112|0;
 $56 = sp + 24|0;
 $60 = sp + 84|0;
 $62 = sp + 76|0;
 $64 = sp + 68|0;
 $68 = sp + 52|0;
 $69 = sp;
 $71 = sp + 44|0;
 $72 = sp + 40|0;
 $73 = sp + 36|0;
 $67 = $1;
 $66 = $68;
 $74 = $66;
 $65 = $74;
 $70 = 1;
 while(1) {
  $75 = $70;
  $76 = ($75|0)<=(4);
  if (!($76)) {
   break;
  }
  $77 = $70;
  $78 = (($69) + ($77<<2)|0);
  HEAP32[$78>>2] = 0;
  $79 = $70;
  $80 = (($79) + 1)|0;
  $70 = $80;
 }
 $63 = $0;
 $81 = $63;
 $61 = $81;
 $82 = $61;
 $59 = $82;
 $83 = $59;
 $84 = HEAP32[$83>>2]|0;
 $57 = $60;
 $58 = $84;
 $85 = $57;
 $86 = $58;
 HEAP32[$85>>2] = $86;
 $87 = HEAP32[$60>>2]|0;
 HEAP32[$64>>2] = $87;
 ;HEAP8[$56>>0]=HEAP8[$64>>0]|0;HEAP8[$56+1>>0]=HEAP8[$64+1>>0]|0;HEAP8[$56+2>>0]=HEAP8[$64+2>>0]|0;HEAP8[$56+3>>0]=HEAP8[$64+3>>0]|0;
 $55 = $62;
 $88 = $55;
 ;HEAP32[$88>>2]=HEAP32[$56>>2]|0;
 $89 = HEAP32[$62>>2]|0;
 HEAP32[$71>>2] = $89;
 ;HEAP32[$68>>2]=HEAP32[$71>>2]|0;
 while(1) {
  $14 = $0;
  $90 = $14;
  $12 = $90;
  $91 = $12;
  $10 = $91;
  $92 = $10;
  $93 = ((($92)) + 4|0);
  $9 = $93;
  $94 = $9;
  $8 = $94;
  $95 = $8;
  $7 = $95;
  $96 = $7;
  $6 = $96;
  $97 = $6;
  $4 = $11;
  $5 = $97;
  $98 = $4;
  $99 = $5;
  HEAP32[$98>>2] = $99;
  $100 = HEAP32[$11>>2]|0;
  HEAP32[$15>>2] = $100;
  ;HEAP8[$3>>0]=HEAP8[$15>>0]|0;HEAP8[$3+1>>0]=HEAP8[$15+1>>0]|0;HEAP8[$3+2>>0]=HEAP8[$15+2>>0]|0;HEAP8[$3+3>>0]=HEAP8[$15+3>>0]|0;
  $2 = $13;
  $101 = $2;
  ;HEAP32[$101>>2]=HEAP32[$3>>2]|0;
  $102 = HEAP32[$13>>2]|0;
  HEAP32[$72>>2] = $102;
  $20 = $68;
  $21 = $72;
  $103 = $20;
  $104 = $21;
  $18 = $103;
  $19 = $104;
  $105 = $18;
  $106 = $19;
  $16 = $105;
  $17 = $106;
  $107 = $16;
  $108 = HEAP32[$107>>2]|0;
  $109 = $17;
  $110 = HEAP32[$109>>2]|0;
  $111 = ($108|0)==($110|0);
  $112 = $111 ^ 1;
  if (!($112)) {
   break;
  }
  $26 = $68;
  $113 = $26;
  $25 = $113;
  $114 = $25;
  $24 = $114;
  $115 = $24;
  $116 = HEAP32[$115>>2]|0;
  $117 = ((($116)) + 16|0);
  $23 = $117;
  $118 = $23;
  $22 = $118;
  $119 = $22;
  $120 = HEAP32[$119>>2]|0;
  $121 = ($120|0)>=(100000);
  do {
   if (!($121)) {
    $31 = $68;
    $122 = $31;
    $30 = $122;
    $123 = $30;
    $29 = $123;
    $124 = $29;
    $125 = HEAP32[$124>>2]|0;
    $126 = ((($125)) + 16|0);
    $28 = $126;
    $127 = $28;
    $27 = $127;
    $128 = $27;
    $129 = ((($128)) + 4|0);
    $35 = $129;
    $130 = $35;
    $34 = $130;
    $131 = $34;
    $132 = ((($131)) + 8|0);
    $33 = $132;
    $133 = $33;
    $32 = $133;
    $134 = $32;
    $135 = HEAP32[$134>>2]|0;
    $136 = ($135>>>0)<=(3);
    if ($136) {
     $40 = $68;
     $137 = $40;
     $39 = $137;
     $138 = $39;
     $38 = $138;
     $139 = $38;
     $140 = HEAP32[$139>>2]|0;
     $141 = ((($140)) + 16|0);
     $37 = $141;
     $142 = $37;
     $36 = $142;
     $143 = $36;
     $144 = ((($143)) + 4|0);
     $44 = $144;
     $145 = $44;
     $43 = $145;
     $146 = $43;
     $147 = ((($146)) + 8|0);
     $42 = $147;
     $148 = $42;
     $41 = $148;
     $149 = $41;
     $150 = HEAP32[$149>>2]|0;
     $151 = (($69) + ($150<<2)|0);
     $152 = HEAP32[$151>>2]|0;
     $153 = (($152) + 1)|0;
     HEAP32[$151>>2] = $153;
     break;
    } else {
     $154 = ((($69)) + 16|0);
     $155 = HEAP32[$154>>2]|0;
     $156 = (($155) + 1)|0;
     HEAP32[$154>>2] = $156;
     break;
    }
   }
  } while(0);
  $53 = $68;
  $54 = 0;
  $157 = $53;
  ;HEAP32[$52>>2]=HEAP32[$157>>2]|0;
  $51 = $157;
  $158 = $51;
  $50 = $158;
  $159 = $50;
  $160 = HEAP32[$159>>2]|0;
  $49 = $160;
  $161 = $49;
  $162 = ((($161)) + 4|0);
  $163 = HEAP32[$162>>2]|0;
  $164 = ($163|0)!=(0|0);
  if ($164) {
   $165 = $49;
   $166 = ((($165)) + 4|0);
   $167 = HEAP32[$166>>2]|0;
   $47 = $167;
   while(1) {
    $168 = $47;
    $169 = HEAP32[$168>>2]|0;
    $170 = ($169|0)!=(0|0);
    $171 = $47;
    if (!($170)) {
     break;
    }
    $172 = HEAP32[$171>>2]|0;
    $47 = $172;
   }
   $48 = $171;
  } else {
   while(1) {
    $173 = $49;
    $46 = $173;
    $174 = $46;
    $175 = $46;
    $176 = ((($175)) + 8|0);
    $177 = HEAP32[$176>>2]|0;
    $178 = HEAP32[$177>>2]|0;
    $179 = ($174|0)==($178|0);
    $180 = $179 ^ 1;
    $181 = $49;
    if (!($180)) {
     break;
    }
    $45 = $181;
    $182 = $45;
    $183 = ((($182)) + 8|0);
    $184 = HEAP32[$183>>2]|0;
    $49 = $184;
   }
   $185 = ((($181)) + 8|0);
   $186 = HEAP32[$185>>2]|0;
   $48 = $186;
  }
  $187 = $48;
  HEAP32[$159>>2] = $187;
  $188 = HEAP32[$52>>2]|0;
  HEAP32[$73>>2] = $188;
 }
 $189 = ((($69)) + 4|0);
 $190 = HEAP32[$189>>2]|0;
 $191 = ((($69)) + 8|0);
 $192 = HEAP32[$191>>2]|0;
 $193 = ((($69)) + 12|0);
 $194 = HEAP32[$193>>2]|0;
 $195 = ((($69)) + 16|0);
 $196 = HEAP32[$195>>2]|0;
 $197 = $67;
 $198 = (__Z23calculateMinHandsSimpleiiiii($190,$192,$194,$196,$197)|0);
 STACKTOP = sp;return ($198|0);
}
function __Z7AddCardRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEcc($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $4 = sp;
 $6 = sp + 48|0;
 $9 = sp + 36|0;
 $12 = sp + 24|0;
 $17 = sp + 8|0;
 $18 = sp + 4|0;
 $14 = $0;
 $15 = $1;
 $16 = $2;
 $13 = $17;
 $19 = $13;
 HEAP32[$19>>2] = 0;
 $20 = ((($19)) + 4|0);
 HEAP8[$20>>0] = 0;
 $21 = $16;
 $22 = ((($17)) + 4|0);
 HEAP8[$22>>0] = $21;
 $23 = $15;
 $24 = $23 << 24 >> 24;
 $25 = (($24) - 48)|0;
 $26 = ($25|0)<=(9);
 if ($26) {
  $27 = $15;
  $28 = $27 << 24 >> 24;
  $29 = (($28) - 48)|0;
  $30 = ($29|0)>=(2);
  if ($30) {
   $31 = $15;
   $32 = $31 << 24 >> 24;
   $33 = (($32) - 48)|0;
   HEAP32[$17>>2] = $33;
  } else {
   label = 4;
  }
 } else {
  label = 4;
 }
 do {
  if ((label|0) == 4) {
   $34 = $15;
   $35 = $34 << 24 >> 24;
   $36 = ($35|0)==(65);
   if ($36) {
    HEAP32[$17>>2] = 1;
    break;
   }
   $37 = $15;
   $38 = $37 << 24 >> 24;
   $39 = ($38|0)==(74);
   if ($39) {
    HEAP32[$17>>2] = 11;
    break;
   }
   $40 = $15;
   $41 = $40 << 24 >> 24;
   $42 = ($41|0)==(75);
   if ($42) {
    HEAP32[$17>>2] = 13;
    break;
   }
   $43 = $15;
   $44 = $43 << 24 >> 24;
   $45 = ($44|0)==(81);
   if ($45) {
    HEAP32[$17>>2] = 12;
    break;
   }
   $46 = $15;
   $47 = $46 << 24 >> 24;
   $48 = ($47|0)==(48);
   if ($48) {
    HEAP32[$17>>2] = 10;
    break;
   }
   $49 = $15;
   $50 = $49 << 24 >> 24;
   $51 = ($50|0)==(88);
   if (!($51)) {
    ___assert_fail((3758|0),(3782|0),154,(3795|0));
    // unreachable;
   }
   $52 = $16;
   $53 = $52 << 24 >> 24;
   $54 = ($53|0)==(82);
   if ($54) {
    HEAP32[$17>>2] = 100001;
    break;
   }
   $55 = $16;
   $56 = $55 << 24 >> 24;
   $57 = ($56|0)==(66);
   if ($57) {
    HEAP32[$17>>2] = 100000;
   }
  }
 } while(0);
 $58 = $14;
 $59 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($58,$17)|0);
 $60 = ((($17)) + 4|0);
 $10 = $59;
 $11 = $60;
 $61 = $10;
 $62 = $11;
 $7 = $61;
 $8 = $62;
 $63 = $7;
 $64 = $8;
 $5 = $64;
 $65 = $5;
 $66 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__emplace_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEEDpOT_($63,$65)|0);
 HEAP32[$6>>2] = $66;
 $67 = HEAP32[$6>>2]|0;
 HEAP32[$12>>2] = $67;
 ;HEAP8[$4>>0]=HEAP8[$12>>0]|0;HEAP8[$4+1>>0]=HEAP8[$12+1>>0]|0;HEAP8[$4+2>>0]=HEAP8[$12+2>>0]|0;HEAP8[$4+3>>0]=HEAP8[$12+3>>0]|0;
 $3 = $9;
 $68 = $3;
 $69 = HEAP32[$4>>2]|0;
 HEAP32[$68>>2] = $69;
 $70 = HEAP32[$9>>2]|0;
 HEAP32[$18>>2] = $70;
 STACKTOP = sp;return;
}
function __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $3 = sp + 117|0;
 $14 = sp + 24|0;
 $15 = sp + 16|0;
 $16 = sp + 8|0;
 $17 = sp;
 $20 = sp + 116|0;
 $21 = sp + 115|0;
 $22 = sp + 114|0;
 $23 = sp + 113|0;
 $25 = sp + 52|0;
 $29 = sp + 32|0;
 $30 = sp + 28|0;
 $31 = sp + 112|0;
 $27 = $0;
 $28 = $1;
 $32 = $27;
 $33 = $28;
 $34 = $28;
 $26 = $34;
 $35 = $26;
 $24 = $35;
 $36 = $24;
 $18 = $25;
 $19 = $36;
 $37 = $18;
 $38 = $19;
 ;HEAP8[$14>>0]=HEAP8[$23>>0]|0;
 ;HEAP8[$15>>0]=HEAP8[$22>>0]|0;
 ;HEAP8[$16>>0]=HEAP8[$21>>0]|0;
 ;HEAP8[$17>>0]=HEAP8[$20>>0]|0;
 $12 = $37;
 $13 = $38;
 $39 = $12;
 $40 = $13;
 $11 = $40;
 $41 = $11;
 $9 = $39;
 $10 = $41;
 $42 = $9;
 $43 = $10;
 $8 = $43;
 $44 = $8;
 HEAP32[$42>>2] = $44;
 $45 = HEAP32[$25>>2]|0;
 HEAP32[$30>>2] = $45;
 $2 = $3;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE25__emplace_unique_key_argsIiJRKNS_21piecewise_construct_tENS_5tupleIJRKiEEENSI_IJEEEEEENS_4pairINS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEEbEERKT_DpOT0_($29,$32,$33,8266,$30,$31);
 $7 = $29;
 $46 = $7;
 $6 = $46;
 $47 = $6;
 $48 = HEAP32[$47>>2]|0;
 $49 = ((($48)) + 16|0);
 $5 = $49;
 $50 = $5;
 $4 = $50;
 $51 = $4;
 $52 = ((($51)) + 4|0);
 STACKTOP = sp;return ($52|0);
}
function __Z9CardToStric($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$expand_i1_val = 0, $$expand_i1_val3 = 0, $$pre_trunc = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $29 = sp + 92|0;
 $27 = $1;
 $28 = $2;
 $$expand_i1_val = 0;
 HEAP8[$29>>0] = $$expand_i1_val;
 $25 = $0;
 $26 = 8264;
 $30 = $25;
 $24 = $30;
 $31 = $24;
 $23 = $31;
 $32 = $23;
 ;HEAP32[$32>>2]=0|0;HEAP32[$32+4>>2]=0|0;HEAP32[$32+8>>2]=0|0;
 $22 = $31;
 $33 = $22;
 $21 = $33;
 $34 = $26;
 $35 = $26;
 $36 = (__ZNSt3__211char_traitsIcE6lengthEPKc($35)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($30,$34,$36);
 $37 = $27;
 $38 = ($37|0)>=(2);
 $39 = $27;
 $40 = ($39|0)<=(9);
 $or$cond = $38 & $40;
 $41 = $27;
 do {
  if ($or$cond) {
   $42 = (($41) + 48)|0;
   $43 = $42&255;
   $19 = $0;
   $20 = $43;
   $44 = $19;
   $45 = $20;
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc($44,$45);
  } else {
   $46 = ($41|0)==(1);
   if ($46) {
    $17 = $0;
    $18 = 3803;
    $47 = $17;
    $48 = $18;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($47,$48)|0);
    break;
   }
   $49 = $27;
   $50 = ($49|0)==(11);
   if ($50) {
    $15 = $0;
    $16 = 3805;
    $51 = $15;
    $52 = $16;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($51,$52)|0);
    break;
   }
   $53 = $27;
   $54 = ($53|0)==(13);
   if ($54) {
    $13 = $0;
    $14 = 3807;
    $55 = $13;
    $56 = $14;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($55,$56)|0);
    break;
   }
   $57 = $27;
   $58 = ($57|0)==(12);
   if ($58) {
    $11 = $0;
    $12 = 3809;
    $59 = $11;
    $60 = $12;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($59,$60)|0);
    break;
   }
   $61 = $27;
   $62 = ($61|0)==(10);
   if ($62) {
    $9 = $0;
    $10 = 3811;
    $63 = $9;
    $64 = $10;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($63,$64)|0);
   }
  }
 } while(0);
 $65 = $27;
 $66 = ($65|0)==(100001);
 do {
  if ($66) {
   $7 = $0;
   $8 = 3813;
   $67 = $7;
   $68 = $8;
   (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($67,$68)|0);
  } else {
   $69 = $27;
   $70 = ($69|0)==(100000);
   if ($70) {
    $5 = $0;
    $6 = 3816;
    $71 = $5;
    $72 = $6;
    (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($71,$72)|0);
    break;
   } else {
    $73 = $28;
    $3 = $0;
    $4 = $73;
    $74 = $3;
    $75 = $4;
    __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc($74,$75);
    break;
   }
  }
 } while(0);
 $$expand_i1_val3 = 1;
 HEAP8[$29>>0] = $$expand_i1_val3;
 $$pre_trunc = HEAP8[$29>>0]|0;
 $76 = $$pre_trunc&1;
 if ($76) {
  STACKTOP = sp;return;
 }
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($0);
 STACKTOP = sp;return;
}
function __Z13getActualRanki($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ($2|0)==(14);
 $4 = $1;
 $5 = $3 ? 1 : $4;
 STACKTOP = sp;return ($5|0);
}
function __Z11ExistShunZiRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEiiiicSD_Ri($0,$1,$2,$3,$4,$5,$6,$7) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 $6 = $6|0;
 $7 = $7|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$expand_i1_val4 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0;
 var $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0;
 var $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0;
 var $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0;
 var $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0;
 var $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0;
 var $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0;
 var $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0;
 var $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0;
 var $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0;
 var $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0;
 var $296 = 0, $297 = 0, $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0;
 var $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0;
 var $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0;
 var $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0;
 var $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0;
 var $57 = 0, $58 = 0, $59 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 528|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(528|0);
 $14 = sp + 492|0;
 $18 = sp + 48|0;
 $20 = sp + 472|0;
 $23 = sp + 460|0;
 $26 = sp + 448|0;
 $34 = sp + 40|0;
 $37 = sp + 524|0;
 $45 = sp + 32|0;
 $53 = sp + 352|0;
 $55 = sp + 344|0;
 $57 = sp + 336|0;
 $65 = sp + 24|0;
 $68 = sp + 523|0;
 $70 = sp + 16|0;
 $74 = sp + 280|0;
 $76 = sp + 272|0;
 $78 = sp + 264|0;
 $85 = sp + 8|0;
 $88 = sp + 522|0;
 $90 = sp;
 $92 = sp + 220|0;
 $95 = sp + 208|0;
 $98 = sp + 196|0;
 $104 = sp + 521|0;
 $109 = sp + 156|0;
 $110 = sp + 520|0;
 $115 = sp + 136|0;
 $116 = sp + 132|0;
 $117 = sp + 128|0;
 $119 = sp + 120|0;
 $120 = sp + 116|0;
 $122 = sp + 108|0;
 $123 = sp + 104|0;
 $124 = sp + 100|0;
 $125 = sp + 96|0;
 $128 = sp + 84|0;
 $129 = sp + 80|0;
 $130 = sp + 76|0;
 $133 = sp + 64|0;
 $134 = sp + 60|0;
 $135 = sp + 56|0;
 $136 = sp + 52|0;
 $105 = $0;
 $106 = $1;
 $107 = $2;
 $108 = $3;
 HEAP32[$109>>2] = $4;
 HEAP8[$110>>0] = $5;
 $111 = $6;
 $112 = $7;
 $137 = $107;
 $138 = $108;
 $139 = (($137) + ($138))|0;
 $140 = (($139) - 1)|0;
 $141 = ($140|0)<=(14);
 if (!($141)) {
  ___assert_fail((3819|0),(3782|0),199,(3853|0));
  // unreachable;
 }
 $142 = $111;
 $103 = $142;
 $143 = $103;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE5clearEv($143);
 $144 = HEAP8[$110>>0]|0;
 $145 = $144 << 24 >> 24;
 $146 = ($145|0)==(65);
 L4: do {
  if ($146) {
   $113 = 0;
   $147 = $107;
   $114 = $147;
   while(1) {
    $148 = $114;
    $149 = $107;
    $150 = $108;
    $151 = (($149) + ($150))|0;
    $152 = ($148|0)<($151|0);
    if (!($152)) {
     break;
    }
    HEAP32[$115>>2] = 0;
    $153 = HEAP32[$109>>2]|0;
    $154 = $105;
    $155 = $114;
    $156 = (__Z13getActualRanki($155)|0);
    HEAP32[$117>>2] = $156;
    $157 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixEOi($154,$117)|0);
    $102 = $157;
    $158 = $102;
    $101 = $158;
    $159 = $101;
    $160 = ((($159)) + 8|0);
    $100 = $160;
    $161 = $100;
    $99 = $161;
    $162 = $99;
    $163 = HEAP32[$162>>2]|0;
    $164 = (($153) - ($163))|0;
    HEAP32[$116>>2] = $164;
    $86 = $115;
    $87 = $116;
    $165 = $86;
    $166 = $87;
    ;HEAP8[$85>>0]=HEAP8[$88>>0]|0;
    $83 = $165;
    $84 = $166;
    $167 = $83;
    $168 = $84;
    $80 = $85;
    $81 = $167;
    $82 = $168;
    $169 = $81;
    $170 = HEAP32[$169>>2]|0;
    $171 = $82;
    $172 = HEAP32[$171>>2]|0;
    $173 = ($170|0)<($172|0);
    $174 = $84;
    $175 = $83;
    $176 = $173 ? $174 : $175;
    $177 = HEAP32[$176>>2]|0;
    $178 = $113;
    $179 = (($178) + ($177))|0;
    $113 = $179;
    $180 = $114;
    $181 = (($180) + 1)|0;
    $114 = $181;
   }
   $182 = $113;
   $183 = $106;
   $184 = ($182|0)>($183|0);
   if ($184) {
    $$expand_i1_val = 0;
    HEAP8[$104>>0] = $$expand_i1_val;
    $$pre_trunc = HEAP8[$104>>0]|0;
    $368 = $$pre_trunc&1;
    STACKTOP = sp;return ($368|0);
   }
   $185 = $113;
   $186 = $112;
   HEAP32[$186>>2] = $185;
   $187 = $107;
   $118 = $187;
   while(1) {
    $188 = $118;
    $189 = $107;
    $190 = $108;
    $191 = (($189) + ($190))|0;
    $192 = ($188|0)<($191|0);
    if (!($192)) {
     break L4;
    }
    $193 = $118;
    $194 = (__Z13getActualRanki($193)|0);
    HEAP32[$119>>2] = $194;
    $79 = $120;
    $121 = 0;
    $195 = $105;
    $196 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($195,$119)|0);
    $77 = $196;
    $197 = $77;
    $75 = $197;
    $198 = $75;
    $73 = $198;
    $199 = $73;
    $200 = HEAP32[$199>>2]|0;
    $71 = $74;
    $72 = $200;
    $201 = $71;
    $202 = $72;
    HEAP32[$201>>2] = $202;
    $203 = HEAP32[$74>>2]|0;
    HEAP32[$78>>2] = $203;
    ;HEAP8[$70>>0]=HEAP8[$78>>0]|0;HEAP8[$70+1>>0]=HEAP8[$78+1>>0]|0;HEAP8[$70+2>>0]=HEAP8[$78+2>>0]|0;HEAP8[$70+3>>0]=HEAP8[$78+3>>0]|0;
    $69 = $76;
    $204 = $69;
    $205 = HEAP32[$70>>2]|0;
    HEAP32[$204>>2] = $205;
    $206 = HEAP32[$76>>2]|0;
    HEAP32[$122>>2] = $206;
    ;HEAP32[$120>>2]=HEAP32[$122>>2]|0;
    while(1) {
     $207 = $121;
     $208 = HEAP32[$109>>2]|0;
     $209 = ($207|0)<($208|0);
     if (!($209)) {
      break;
     }
     $210 = $105;
     $211 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($210,$119)|0);
     $56 = $211;
     $212 = $56;
     $54 = $212;
     $213 = $54;
     $52 = $213;
     $214 = $52;
     $215 = ((($214)) + 4|0);
     $51 = $215;
     $216 = $51;
     $50 = $216;
     $217 = $50;
     $49 = $217;
     $218 = $49;
     $48 = $218;
     $219 = $48;
     $46 = $53;
     $47 = $219;
     $220 = $46;
     $221 = $47;
     HEAP32[$220>>2] = $221;
     $222 = HEAP32[$53>>2]|0;
     HEAP32[$57>>2] = $222;
     ;HEAP8[$45>>0]=HEAP8[$57>>0]|0;HEAP8[$45+1>>0]=HEAP8[$57+1>>0]|0;HEAP8[$45+2>>0]=HEAP8[$57+2>>0]|0;HEAP8[$45+3>>0]=HEAP8[$57+3>>0]|0;
     $44 = $55;
     $223 = $44;
     $224 = HEAP32[$45>>2]|0;
     HEAP32[$223>>2] = $224;
     $225 = HEAP32[$55>>2]|0;
     HEAP32[$123>>2] = $225;
     $42 = $120;
     $43 = $123;
     $226 = $42;
     $227 = $43;
     $40 = $226;
     $41 = $227;
     $228 = $40;
     $229 = HEAP32[$228>>2]|0;
     $230 = $41;
     $231 = HEAP32[$230>>2]|0;
     $232 = ($229|0)==($231|0);
     $233 = $232 ^ 1;
     if (!($233)) {
      break;
     }
     $234 = $111;
     $235 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($234,$119)|0);
     $39 = $120;
     $236 = $39;
     $38 = $236;
     $237 = $38;
     $238 = HEAP32[$237>>2]|0;
     $239 = ((($238)) + 13|0);
     $24 = $235;
     $25 = $239;
     $240 = $24;
     $241 = $25;
     $21 = $240;
     $22 = $241;
     $242 = $21;
     $243 = $22;
     $19 = $243;
     $244 = $19;
     $245 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__emplace_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEEDpOT_($242,$244)|0);
     HEAP32[$20>>2] = $245;
     $246 = HEAP32[$20>>2]|0;
     HEAP32[$26>>2] = $246;
     ;HEAP8[$18>>0]=HEAP8[$26>>0]|0;HEAP8[$18+1>>0]=HEAP8[$26+1>>0]|0;HEAP8[$18+2>>0]=HEAP8[$26+2>>0]|0;HEAP8[$18+3>>0]=HEAP8[$26+3>>0]|0;
     $17 = $23;
     $247 = $17;
     $248 = HEAP32[$18>>2]|0;
     HEAP32[$247>>2] = $248;
     $249 = HEAP32[$23>>2]|0;
     HEAP32[$124>>2] = $249;
     $250 = $121;
     $251 = (($250) + 1)|0;
     $121 = $251;
     $15 = $120;
     $16 = 0;
     $252 = $15;
     ;HEAP32[$14>>2]=HEAP32[$252>>2]|0;
     $13 = $252;
     $253 = $13;
     $254 = HEAP32[$253>>2]|0;
     $12 = $254;
     $255 = $12;
     $256 = ((($255)) + 4|0);
     $257 = HEAP32[$256>>2]|0;
     $258 = ($257|0)!=(0|0);
     if ($258) {
      $259 = $12;
      $260 = ((($259)) + 4|0);
      $261 = HEAP32[$260>>2]|0;
      $10 = $261;
      while(1) {
       $262 = $10;
       $263 = HEAP32[$262>>2]|0;
       $264 = ($263|0)!=(0|0);
       $265 = $10;
       if (!($264)) {
        break;
       }
       $266 = HEAP32[$265>>2]|0;
       $10 = $266;
      }
      $11 = $265;
     } else {
      while(1) {
       $267 = $12;
       $9 = $267;
       $268 = $9;
       $269 = $9;
       $270 = ((($269)) + 8|0);
       $271 = HEAP32[$270>>2]|0;
       $272 = HEAP32[$271>>2]|0;
       $273 = ($268|0)==($272|0);
       $274 = $273 ^ 1;
       $275 = $12;
       if (!($274)) {
        break;
       }
       $8 = $275;
       $276 = $8;
       $277 = ((($276)) + 8|0);
       $278 = HEAP32[$277>>2]|0;
       $12 = $278;
      }
      $279 = ((($275)) + 8|0);
      $280 = HEAP32[$279>>2]|0;
      $11 = $280;
     }
     $281 = $11;
     HEAP32[$253>>2] = $281;
     $282 = HEAP32[$14>>2]|0;
     HEAP32[$125>>2] = $282;
    }
    $283 = $118;
    $284 = (($283) + 1)|0;
    $118 = $284;
   }
  } else {
   $126 = 0;
   $285 = $107;
   $127 = $285;
   while(1) {
    $286 = $127;
    $287 = $107;
    $288 = $108;
    $289 = (($287) + ($288))|0;
    $290 = ($286|0)<($289|0);
    if (!($290)) {
     break;
    }
    HEAP32[$128>>2] = 0;
    $291 = HEAP32[$109>>2]|0;
    $292 = $105;
    $293 = $127;
    $294 = (__Z13getActualRanki($293)|0);
    HEAP32[$130>>2] = $294;
    $295 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixEOi($292,$130)|0);
    $27 = $295;
    $28 = $110;
    $296 = $27;
    $297 = $28;
    $298 = (__ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__count_multiIcEEmRKT_($296,$297)|0);
    $299 = (($291) - ($298))|0;
    HEAP32[$129>>2] = $299;
    $35 = $128;
    $36 = $129;
    $300 = $35;
    $301 = $36;
    ;HEAP8[$34>>0]=HEAP8[$37>>0]|0;
    $32 = $300;
    $33 = $301;
    $302 = $32;
    $303 = $33;
    $29 = $34;
    $30 = $302;
    $31 = $303;
    $304 = $30;
    $305 = HEAP32[$304>>2]|0;
    $306 = $31;
    $307 = HEAP32[$306>>2]|0;
    $308 = ($305|0)<($307|0);
    $309 = $33;
    $310 = $32;
    $311 = $308 ? $309 : $310;
    $312 = HEAP32[$311>>2]|0;
    $313 = $126;
    $314 = (($313) + ($312))|0;
    $126 = $314;
    $315 = $127;
    $316 = (($315) + 1)|0;
    $127 = $316;
   }
   $317 = $126;
   $318 = $106;
   $319 = ($317|0)>($318|0);
   if ($319) {
    $$expand_i1_val2 = 0;
    HEAP8[$104>>0] = $$expand_i1_val2;
    $$pre_trunc = HEAP8[$104>>0]|0;
    $368 = $$pre_trunc&1;
    STACKTOP = sp;return ($368|0);
   }
   $320 = $126;
   $321 = $112;
   HEAP32[$321>>2] = $320;
   $322 = $107;
   $131 = $322;
   while(1) {
    $323 = $131;
    $324 = $107;
    $325 = $108;
    $326 = (($324) + ($325))|0;
    $327 = ($323|0)<($326|0);
    if (!($327)) {
     break L4;
    }
    $132 = 0;
    while(1) {
     $328 = $132;
     $329 = $105;
     $330 = $131;
     $331 = (__Z13getActualRanki($330)|0);
     HEAP32[$134>>2] = $331;
     $332 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixEOi($329,$134)|0);
     $58 = $332;
     $59 = $110;
     $333 = $58;
     $334 = $59;
     $335 = (__ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__count_multiIcEEmRKT_($333,$334)|0);
     HEAP32[$133>>2] = $335;
     $66 = $109;
     $67 = $133;
     $336 = $66;
     $337 = $67;
     ;HEAP8[$65>>0]=HEAP8[$68>>0]|0;
     $63 = $336;
     $64 = $337;
     $338 = $64;
     $339 = $63;
     $60 = $65;
     $61 = $338;
     $62 = $339;
     $340 = $61;
     $341 = HEAP32[$340>>2]|0;
     $342 = $62;
     $343 = HEAP32[$342>>2]|0;
     $344 = ($341|0)<($343|0);
     $345 = $64;
     $346 = $63;
     $347 = $344 ? $345 : $346;
     $348 = HEAP32[$347>>2]|0;
     $349 = ($328|0)<($348|0);
     if (!($349)) {
      break;
     }
     $350 = $111;
     $351 = $131;
     $352 = (__Z13getActualRanki($351)|0);
     HEAP32[$135>>2] = $352;
     $353 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixEOi($350,$135)|0);
     $96 = $353;
     $97 = $110;
     $354 = $96;
     $355 = $97;
     $93 = $354;
     $94 = $355;
     $356 = $93;
     $357 = $94;
     $91 = $357;
     $358 = $91;
     $359 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__emplace_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEEDpOT_($356,$358)|0);
     HEAP32[$92>>2] = $359;
     $360 = HEAP32[$92>>2]|0;
     HEAP32[$98>>2] = $360;
     ;HEAP8[$90>>0]=HEAP8[$98>>0]|0;HEAP8[$90+1>>0]=HEAP8[$98+1>>0]|0;HEAP8[$90+2>>0]=HEAP8[$98+2>>0]|0;HEAP8[$90+3>>0]=HEAP8[$98+3>>0]|0;
     $89 = $95;
     $361 = $89;
     $362 = HEAP32[$90>>2]|0;
     HEAP32[$361>>2] = $362;
     $363 = HEAP32[$95>>2]|0;
     HEAP32[$136>>2] = $363;
     $364 = $132;
     $365 = (($364) + 1)|0;
     $132 = $365;
    }
    $366 = $131;
    $367 = (($366) + 1)|0;
    $131 = $367;
   }
  }
 } while(0);
 $$expand_i1_val4 = 1;
 HEAP8[$104>>0] = $$expand_i1_val4;
 $$pre_trunc = HEAP8[$104>>0]|0;
 $368 = $$pre_trunc&1;
 STACKTOP = sp;return ($368|0);
}
function __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixEOi($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $3 = sp + 125|0;
 $10 = sp + 24|0;
 $11 = sp + 16|0;
 $12 = sp + 8|0;
 $13 = sp;
 $17 = sp + 124|0;
 $18 = sp + 123|0;
 $19 = sp + 122|0;
 $20 = sp + 121|0;
 $22 = sp + 72|0;
 $31 = sp + 32|0;
 $32 = sp + 28|0;
 $33 = sp + 120|0;
 $29 = $0;
 $30 = $1;
 $34 = $29;
 $35 = $30;
 $36 = $30;
 $28 = $36;
 $37 = $28;
 $23 = $37;
 $38 = $23;
 $21 = $38;
 $39 = $21;
 $15 = $22;
 $16 = $39;
 $40 = $15;
 $41 = $16;
 $14 = $41;
 $42 = $14;
 ;HEAP8[$10>>0]=HEAP8[$20>>0]|0;
 ;HEAP8[$11>>0]=HEAP8[$19>>0]|0;
 ;HEAP8[$12>>0]=HEAP8[$18>>0]|0;
 ;HEAP8[$13>>0]=HEAP8[$17>>0]|0;
 $8 = $40;
 $9 = $42;
 $43 = $8;
 $44 = $9;
 $7 = $44;
 $45 = $7;
 $5 = $43;
 $6 = $45;
 $46 = $5;
 $47 = $6;
 $4 = $47;
 $48 = $4;
 HEAP32[$46>>2] = $48;
 $49 = HEAP32[$22>>2]|0;
 HEAP32[$32>>2] = $49;
 $2 = $3;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE25__emplace_unique_key_argsIiJRKNS_21piecewise_construct_tENS_5tupleIJOiEEENSI_IJEEEEEENS_4pairINS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEEbEERKT_DpOT0_($31,$34,$35,8266,$32,$33);
 $27 = $31;
 $50 = $27;
 $26 = $50;
 $51 = $26;
 $52 = HEAP32[$51>>2]|0;
 $53 = ((($52)) + 16|0);
 $25 = $53;
 $54 = $25;
 $24 = $54;
 $55 = $24;
 $56 = ((($55)) + 4|0);
 STACKTOP = sp;return ($56|0);
}
function __Z3ChuRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEESD_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$byval_copy = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0;
 var $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0;
 var $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0;
 var $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0;
 var $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0;
 var $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0;
 var $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0;
 var $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0;
 var $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0;
 var $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0;
 var $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0;
 var $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0;
 var $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0;
 var $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0;
 var $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0;
 var $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0;
 var $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0;
 var $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0;
 var $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0;
 var $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0;
 var $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 720|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(720|0);
 $$byval_copy = sp + 712|0;
 $3 = sp + 56|0;
 $7 = sp + 692|0;
 $9 = sp + 684|0;
 $11 = sp + 676|0;
 $18 = sp + 48|0;
 $26 = sp + 620|0;
 $28 = sp + 612|0;
 $30 = sp + 604|0;
 $50 = sp + 40|0;
 $62 = sp + 480|0;
 $65 = sp + 468|0;
 $68 = sp + 456|0;
 $81 = sp + 32|0;
 $89 = sp + 376|0;
 $91 = sp + 368|0;
 $93 = sp + 360|0;
 $106 = sp + 24|0;
 $114 = sp + 280|0;
 $116 = sp + 272|0;
 $118 = sp + 264|0;
 $120 = sp + 16|0;
 $124 = sp + 244|0;
 $126 = sp + 236|0;
 $128 = sp + 228|0;
 $130 = sp + 8|0;
 $131 = sp + 220|0;
 $133 = sp + 212|0;
 $134 = sp + 208|0;
 $135 = sp;
 $142 = sp + 180|0;
 $152 = sp + 140|0;
 $160 = sp + 108|0;
 $161 = sp + 104|0;
 $162 = sp + 100|0;
 $163 = sp + 96|0;
 $164 = sp + 92|0;
 $165 = sp + 88|0;
 $166 = sp + 84|0;
 $167 = sp + 80|0;
 $168 = sp + 76|0;
 $169 = sp + 72|0;
 $170 = sp + 68|0;
 $171 = sp + 64|0;
 $172 = sp + 60|0;
 $158 = $0;
 $159 = $1;
 $156 = $160;
 $173 = $156;
 $155 = $173;
 $174 = $159;
 $127 = $174;
 $175 = $127;
 $125 = $175;
 $176 = $125;
 $123 = $176;
 $177 = $123;
 $178 = HEAP32[$177>>2]|0;
 $121 = $124;
 $122 = $178;
 $179 = $121;
 $180 = $122;
 HEAP32[$179>>2] = $180;
 $181 = HEAP32[$124>>2]|0;
 HEAP32[$128>>2] = $181;
 ;HEAP8[$120>>0]=HEAP8[$128>>0]|0;HEAP8[$120+1>>0]=HEAP8[$128+1>>0]|0;HEAP8[$120+2>>0]=HEAP8[$128+2>>0]|0;HEAP8[$120+3>>0]=HEAP8[$128+3>>0]|0;
 $119 = $126;
 $182 = $119;
 ;HEAP32[$182>>2]=HEAP32[$120>>2]|0;
 $183 = HEAP32[$126>>2]|0;
 HEAP32[$161>>2] = $183;
 ;HEAP32[$160>>2]=HEAP32[$161>>2]|0;
 L1: while(1) {
  $184 = $159;
  $117 = $184;
  $185 = $117;
  $115 = $185;
  $186 = $115;
  $113 = $186;
  $187 = $113;
  $188 = ((($187)) + 4|0);
  $112 = $188;
  $189 = $112;
  $111 = $189;
  $190 = $111;
  $110 = $190;
  $191 = $110;
  $109 = $191;
  $192 = $109;
  $107 = $114;
  $108 = $192;
  $193 = $107;
  $194 = $108;
  HEAP32[$193>>2] = $194;
  $195 = HEAP32[$114>>2]|0;
  HEAP32[$118>>2] = $195;
  ;HEAP8[$106>>0]=HEAP8[$118>>0]|0;HEAP8[$106+1>>0]=HEAP8[$118+1>>0]|0;HEAP8[$106+2>>0]=HEAP8[$118+2>>0]|0;HEAP8[$106+3>>0]=HEAP8[$118+3>>0]|0;
  $105 = $116;
  $196 = $105;
  ;HEAP32[$196>>2]=HEAP32[$106>>2]|0;
  $197 = HEAP32[$116>>2]|0;
  HEAP32[$162>>2] = $197;
  $78 = $160;
  $79 = $162;
  $198 = $78;
  $199 = $79;
  $76 = $198;
  $77 = $199;
  $200 = $76;
  $201 = $77;
  $74 = $200;
  $75 = $201;
  $202 = $74;
  $203 = HEAP32[$202>>2]|0;
  $204 = $75;
  $205 = HEAP32[$204>>2]|0;
  $206 = ($203|0)==($205|0);
  $207 = $206 ^ 1;
  if (!($207)) {
   label = 28;
   break;
  }
  $48 = $163;
  $45 = $160;
  $208 = $45;
  $44 = $208;
  $209 = $44;
  $43 = $209;
  $210 = $43;
  $211 = HEAP32[$210>>2]|0;
  $212 = ((($211)) + 16|0);
  $42 = $212;
  $213 = $42;
  $41 = $213;
  $214 = $41;
  $215 = ((($214)) + 4|0);
  $10 = $215;
  $216 = $10;
  $8 = $216;
  $217 = $8;
  $6 = $217;
  $218 = $6;
  $219 = HEAP32[$218>>2]|0;
  $4 = $7;
  $5 = $219;
  $220 = $4;
  $221 = $5;
  HEAP32[$220>>2] = $221;
  $222 = HEAP32[$7>>2]|0;
  HEAP32[$11>>2] = $222;
  ;HEAP8[$3>>0]=HEAP8[$11>>0]|0;HEAP8[$3+1>>0]=HEAP8[$11+1>>0]|0;HEAP8[$3+2>>0]=HEAP8[$11+2>>0]|0;HEAP8[$3+3>>0]=HEAP8[$11+3>>0]|0;
  $2 = $9;
  $223 = $2;
  $224 = HEAP32[$3>>2]|0;
  HEAP32[$223>>2] = $224;
  $225 = HEAP32[$9>>2]|0;
  HEAP32[$164>>2] = $225;
  ;HEAP32[$163>>2]=HEAP32[$164>>2]|0;
  while(1) {
   $16 = $160;
   $226 = $16;
   $15 = $226;
   $227 = $15;
   $14 = $227;
   $228 = $14;
   $229 = HEAP32[$228>>2]|0;
   $230 = ((($229)) + 16|0);
   $13 = $230;
   $231 = $13;
   $12 = $231;
   $232 = $12;
   $233 = ((($232)) + 4|0);
   $29 = $233;
   $234 = $29;
   $27 = $234;
   $235 = $27;
   $25 = $235;
   $236 = $25;
   $237 = ((($236)) + 4|0);
   $24 = $237;
   $238 = $24;
   $23 = $238;
   $239 = $23;
   $22 = $239;
   $240 = $22;
   $21 = $240;
   $241 = $21;
   $19 = $26;
   $20 = $241;
   $242 = $19;
   $243 = $20;
   HEAP32[$242>>2] = $243;
   $244 = HEAP32[$26>>2]|0;
   HEAP32[$30>>2] = $244;
   ;HEAP8[$18>>0]=HEAP8[$30>>0]|0;HEAP8[$18+1>>0]=HEAP8[$30+1>>0]|0;HEAP8[$18+2>>0]=HEAP8[$30+2>>0]|0;HEAP8[$18+3>>0]=HEAP8[$30+3>>0]|0;
   $17 = $28;
   $245 = $17;
   $246 = HEAP32[$18>>2]|0;
   HEAP32[$245>>2] = $246;
   $247 = HEAP32[$28>>2]|0;
   HEAP32[$165>>2] = $247;
   $33 = $163;
   $34 = $165;
   $248 = $33;
   $249 = $34;
   $31 = $248;
   $32 = $249;
   $250 = $31;
   $251 = HEAP32[$250>>2]|0;
   $252 = $32;
   $253 = HEAP32[$252>>2]|0;
   $254 = ($251|0)==($253|0);
   $255 = $254 ^ 1;
   if (!($255)) {
    break;
   }
   $35 = $166;
   $256 = $158;
   $40 = $160;
   $257 = $40;
   $39 = $257;
   $258 = $39;
   $38 = $258;
   $259 = $38;
   $260 = HEAP32[$259>>2]|0;
   $261 = ((($260)) + 16|0);
   $37 = $261;
   $262 = $37;
   $36 = $262;
   $263 = $36;
   $264 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($256,$263)|0);
   $47 = $163;
   $265 = $47;
   $46 = $265;
   $266 = $46;
   $267 = HEAP32[$266>>2]|0;
   $268 = ((($267)) + 13|0);
   $66 = $264;
   $67 = $268;
   $269 = $66;
   $270 = $67;
   $63 = $269;
   $64 = $270;
   $271 = $63;
   $272 = $64;
   $61 = $271;
   $273 = $61;
   $60 = $273;
   $274 = $60;
   $275 = ((($274)) + 4|0);
   $59 = $275;
   $276 = $59;
   $58 = $276;
   $277 = $58;
   $57 = $277;
   $278 = $57;
   $56 = $278;
   $279 = $56;
   $280 = HEAP32[$279>>2]|0;
   $55 = $271;
   $281 = $55;
   $282 = ((($281)) + 4|0);
   $54 = $282;
   $283 = $54;
   $53 = $283;
   $284 = $53;
   $52 = $284;
   $285 = $52;
   $51 = $285;
   $286 = $51;
   $287 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__lower_boundIcEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($271,$272,$280,$286)|0);
   HEAP32[$62>>2] = $287;
   $288 = HEAP32[$62>>2]|0;
   HEAP32[$68>>2] = $288;
   ;HEAP8[$50>>0]=HEAP8[$68>>0]|0;HEAP8[$50+1>>0]=HEAP8[$68+1>>0]|0;HEAP8[$50+2>>0]=HEAP8[$68+2>>0]|0;HEAP8[$50+3>>0]=HEAP8[$68+3>>0]|0;
   $49 = $65;
   $289 = $49;
   $290 = HEAP32[$50>>2]|0;
   HEAP32[$289>>2] = $290;
   $291 = HEAP32[$65>>2]|0;
   HEAP32[$167>>2] = $291;
   ;HEAP32[$166>>2]=HEAP32[$167>>2]|0;
   $292 = $158;
   $73 = $160;
   $293 = $73;
   $72 = $293;
   $294 = $72;
   $71 = $294;
   $295 = $71;
   $296 = HEAP32[$295>>2]|0;
   $297 = ((($296)) + 16|0);
   $70 = $297;
   $298 = $70;
   $69 = $298;
   $299 = $69;
   $300 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($292,$299)|0);
   $92 = $300;
   $301 = $92;
   $90 = $301;
   $302 = $90;
   $88 = $302;
   $303 = $88;
   $304 = ((($303)) + 4|0);
   $87 = $304;
   $305 = $87;
   $86 = $305;
   $306 = $86;
   $85 = $306;
   $307 = $85;
   $84 = $307;
   $308 = $84;
   $82 = $89;
   $83 = $308;
   $309 = $82;
   $310 = $83;
   HEAP32[$309>>2] = $310;
   $311 = HEAP32[$89>>2]|0;
   HEAP32[$93>>2] = $311;
   ;HEAP8[$81>>0]=HEAP8[$93>>0]|0;HEAP8[$81+1>>0]=HEAP8[$93+1>>0]|0;HEAP8[$81+2>>0]=HEAP8[$93+2>>0]|0;HEAP8[$81+3>>0]=HEAP8[$93+3>>0]|0;
   $80 = $91;
   $312 = $80;
   $313 = HEAP32[$81>>2]|0;
   HEAP32[$312>>2] = $313;
   $314 = HEAP32[$91>>2]|0;
   HEAP32[$168>>2] = $314;
   $94 = $166;
   $95 = $168;
   $315 = $94;
   $316 = HEAP32[$315>>2]|0;
   $317 = $95;
   $318 = HEAP32[$317>>2]|0;
   $319 = ($316|0)==($318|0);
   if ($319) {
    label = 7;
    break L1;
   }
   $97 = $166;
   $320 = $97;
   $96 = $320;
   $321 = $96;
   $322 = HEAP32[$321>>2]|0;
   $323 = ((($322)) + 13|0);
   $324 = HEAP8[$323>>0]|0;
   $325 = $324 << 24 >> 24;
   $99 = $163;
   $326 = $99;
   $98 = $326;
   $327 = $98;
   $328 = HEAP32[$327>>2]|0;
   $329 = ((($328)) + 13|0);
   $330 = HEAP8[$329>>0]|0;
   $331 = $330 << 24 >> 24;
   $332 = ($325|0)!=($331|0);
   if ($332) {
    label = 7;
    break L1;
   }
   $333 = $158;
   $104 = $160;
   $334 = $104;
   $103 = $334;
   $335 = $103;
   $102 = $335;
   $336 = $102;
   $337 = HEAP32[$336>>2]|0;
   $338 = ((($337)) + 16|0);
   $101 = $338;
   $339 = $101;
   $100 = $339;
   $340 = $100;
   $341 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($333,$340)|0);
   ;HEAP32[$169>>2]=HEAP32[$166>>2]|0;
   ;HEAP8[$135>>0]=HEAP8[$169>>0]|0;HEAP8[$135+1>>0]=HEAP8[$169+1>>0]|0;HEAP8[$135+2>>0]=HEAP8[$169+2>>0]|0;HEAP8[$135+3>>0]=HEAP8[$169+3>>0]|0;
   $132 = $341;
   $342 = $132;
   ;HEAP32[$134>>2]=HEAP32[$135>>2]|0;
   ;HEAP32[$$byval_copy>>2]=HEAP32[$134>>2]|0;
   $343 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE5eraseENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEE($342,$$byval_copy)|0);
   HEAP32[$133>>2] = $343;
   ;HEAP8[$130>>0]=HEAP8[$133>>0]|0;HEAP8[$130+1>>0]=HEAP8[$133+1>>0]|0;HEAP8[$130+2>>0]=HEAP8[$133+2>>0]|0;HEAP8[$130+3>>0]=HEAP8[$133+3>>0]|0;
   $129 = $131;
   $344 = $129;
   $345 = HEAP32[$130>>2]|0;
   HEAP32[$344>>2] = $345;
   $346 = HEAP32[$131>>2]|0;
   HEAP32[$170>>2] = $346;
   $143 = $163;
   $144 = 0;
   $347 = $143;
   ;HEAP32[$142>>2]=HEAP32[$347>>2]|0;
   $141 = $347;
   $348 = $141;
   $349 = HEAP32[$348>>2]|0;
   $140 = $349;
   $350 = $140;
   $351 = ((($350)) + 4|0);
   $352 = HEAP32[$351>>2]|0;
   $353 = ($352|0)!=(0|0);
   if ($353) {
    $354 = $140;
    $355 = ((($354)) + 4|0);
    $356 = HEAP32[$355>>2]|0;
    $138 = $356;
    while(1) {
     $357 = $138;
     $358 = HEAP32[$357>>2]|0;
     $359 = ($358|0)!=(0|0);
     $360 = $138;
     if (!($359)) {
      break;
     }
     $361 = HEAP32[$360>>2]|0;
     $138 = $361;
    }
    $139 = $360;
   } else {
    while(1) {
     $362 = $140;
     $137 = $362;
     $363 = $137;
     $364 = $137;
     $365 = ((($364)) + 8|0);
     $366 = HEAP32[$365>>2]|0;
     $367 = HEAP32[$366>>2]|0;
     $368 = ($363|0)==($367|0);
     $369 = $368 ^ 1;
     $370 = $140;
     if (!($369)) {
      break;
     }
     $136 = $370;
     $371 = $136;
     $372 = ((($371)) + 8|0);
     $373 = HEAP32[$372>>2]|0;
     $140 = $373;
    }
    $374 = ((($370)) + 8|0);
    $375 = HEAP32[$374>>2]|0;
    $139 = $375;
   }
   $376 = $139;
   HEAP32[$348>>2] = $376;
   $377 = HEAP32[$142>>2]|0;
   HEAP32[$171>>2] = $377;
  }
  $153 = $160;
  $154 = 0;
  $378 = $153;
  ;HEAP32[$152>>2]=HEAP32[$378>>2]|0;
  $151 = $378;
  $379 = $151;
  $150 = $379;
  $380 = $150;
  $381 = HEAP32[$380>>2]|0;
  $149 = $381;
  $382 = $149;
  $383 = ((($382)) + 4|0);
  $384 = HEAP32[$383>>2]|0;
  $385 = ($384|0)!=(0|0);
  if ($385) {
   $386 = $149;
   $387 = ((($386)) + 4|0);
   $388 = HEAP32[$387>>2]|0;
   $147 = $388;
   while(1) {
    $389 = $147;
    $390 = HEAP32[$389>>2]|0;
    $391 = ($390|0)!=(0|0);
    $392 = $147;
    if (!($391)) {
     break;
    }
    $393 = HEAP32[$392>>2]|0;
    $147 = $393;
   }
   $148 = $392;
  } else {
   while(1) {
    $394 = $149;
    $146 = $394;
    $395 = $146;
    $396 = $146;
    $397 = ((($396)) + 8|0);
    $398 = HEAP32[$397>>2]|0;
    $399 = HEAP32[$398>>2]|0;
    $400 = ($395|0)==($399|0);
    $401 = $400 ^ 1;
    $402 = $149;
    if (!($401)) {
     break;
    }
    $145 = $402;
    $403 = $145;
    $404 = ((($403)) + 8|0);
    $405 = HEAP32[$404>>2]|0;
    $149 = $405;
   }
   $406 = ((($402)) + 8|0);
   $407 = HEAP32[$406>>2]|0;
   $148 = $407;
  }
  $408 = $148;
  HEAP32[$380>>2] = $408;
  $409 = HEAP32[$152>>2]|0;
  HEAP32[$172>>2] = $409;
 }
 if ((label|0) == 7) {
  $157 = -1;
  $410 = $157;
  STACKTOP = sp;return ($410|0);
 }
 else if ((label|0) == 28) {
  $157 = 0;
  $410 = $157;
  STACKTOP = sp;return ($410|0);
 }
 return (0)|0;
}
function __Z2MoRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEESD_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0;
 var $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0;
 var $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0;
 var $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0;
 var $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0;
 var $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0;
 var $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0;
 var $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0;
 var $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0;
 var $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 496|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(496|0);
 $15 = sp + 32|0;
 $19 = sp + 420|0;
 $21 = sp + 412|0;
 $23 = sp + 404|0;
 $30 = sp + 24|0;
 $38 = sp + 348|0;
 $40 = sp + 340|0;
 $42 = sp + 332|0;
 $53 = sp + 16|0;
 $61 = sp + 260|0;
 $63 = sp + 252|0;
 $65 = sp + 244|0;
 $69 = sp + 8|0;
 $73 = sp + 216|0;
 $75 = sp + 208|0;
 $77 = sp + 200|0;
 $79 = sp;
 $81 = sp + 188|0;
 $84 = sp + 176|0;
 $87 = sp + 164|0;
 $94 = sp + 136|0;
 $104 = sp + 96|0;
 $111 = sp + 68|0;
 $112 = sp + 64|0;
 $113 = sp + 60|0;
 $114 = sp + 56|0;
 $115 = sp + 52|0;
 $116 = sp + 48|0;
 $117 = sp + 44|0;
 $118 = sp + 40|0;
 $119 = sp + 36|0;
 $109 = $0;
 $110 = $1;
 $108 = $111;
 $120 = $108;
 $107 = $120;
 $121 = $110;
 $76 = $121;
 $122 = $76;
 $74 = $122;
 $123 = $74;
 $72 = $123;
 $124 = $72;
 $125 = HEAP32[$124>>2]|0;
 $70 = $73;
 $71 = $125;
 $126 = $70;
 $127 = $71;
 HEAP32[$126>>2] = $127;
 $128 = HEAP32[$73>>2]|0;
 HEAP32[$77>>2] = $128;
 ;HEAP8[$69>>0]=HEAP8[$77>>0]|0;HEAP8[$69+1>>0]=HEAP8[$77+1>>0]|0;HEAP8[$69+2>>0]=HEAP8[$77+2>>0]|0;HEAP8[$69+3>>0]=HEAP8[$77+3>>0]|0;
 $68 = $75;
 $129 = $68;
 ;HEAP32[$129>>2]=HEAP32[$69>>2]|0;
 $130 = HEAP32[$75>>2]|0;
 HEAP32[$112>>2] = $130;
 ;HEAP32[$111>>2]=HEAP32[$112>>2]|0;
 while(1) {
  $131 = $110;
  $64 = $131;
  $132 = $64;
  $62 = $132;
  $133 = $62;
  $60 = $133;
  $134 = $60;
  $135 = ((($134)) + 4|0);
  $59 = $135;
  $136 = $59;
  $58 = $136;
  $137 = $58;
  $57 = $137;
  $138 = $57;
  $56 = $138;
  $139 = $56;
  $54 = $61;
  $55 = $139;
  $140 = $54;
  $141 = $55;
  HEAP32[$140>>2] = $141;
  $142 = HEAP32[$61>>2]|0;
  HEAP32[$65>>2] = $142;
  ;HEAP8[$53>>0]=HEAP8[$65>>0]|0;HEAP8[$53+1>>0]=HEAP8[$65+1>>0]|0;HEAP8[$53+2>>0]=HEAP8[$65+2>>0]|0;HEAP8[$53+3>>0]=HEAP8[$65+3>>0]|0;
  $52 = $63;
  $143 = $52;
  ;HEAP32[$143>>2]=HEAP32[$53>>2]|0;
  $144 = HEAP32[$63>>2]|0;
  HEAP32[$113>>2] = $144;
  $6 = $111;
  $7 = $113;
  $145 = $6;
  $146 = $7;
  $4 = $145;
  $5 = $146;
  $147 = $4;
  $148 = $5;
  $2 = $147;
  $3 = $148;
  $149 = $2;
  $150 = HEAP32[$149>>2]|0;
  $151 = $3;
  $152 = HEAP32[$151>>2]|0;
  $153 = ($150|0)==($152|0);
  $154 = $153 ^ 1;
  if (!($154)) {
   break;
  }
  $8 = $114;
  $13 = $111;
  $155 = $13;
  $12 = $155;
  $156 = $12;
  $11 = $156;
  $157 = $11;
  $158 = HEAP32[$157>>2]|0;
  $159 = ((($158)) + 16|0);
  $10 = $159;
  $160 = $10;
  $9 = $160;
  $161 = $9;
  $162 = ((($161)) + 4|0);
  $22 = $162;
  $163 = $22;
  $20 = $163;
  $164 = $20;
  $18 = $164;
  $165 = $18;
  $166 = HEAP32[$165>>2]|0;
  $16 = $19;
  $17 = $166;
  $167 = $16;
  $168 = $17;
  HEAP32[$167>>2] = $168;
  $169 = HEAP32[$19>>2]|0;
  HEAP32[$23>>2] = $169;
  ;HEAP8[$15>>0]=HEAP8[$23>>0]|0;HEAP8[$15+1>>0]=HEAP8[$23+1>>0]|0;HEAP8[$15+2>>0]=HEAP8[$23+2>>0]|0;HEAP8[$15+3>>0]=HEAP8[$23+3>>0]|0;
  $14 = $21;
  $170 = $14;
  $171 = HEAP32[$15>>2]|0;
  HEAP32[$170>>2] = $171;
  $172 = HEAP32[$21>>2]|0;
  HEAP32[$115>>2] = $172;
  ;HEAP32[$114>>2]=HEAP32[$115>>2]|0;
  while(1) {
   $28 = $111;
   $173 = $28;
   $27 = $173;
   $174 = $27;
   $26 = $174;
   $175 = $26;
   $176 = HEAP32[$175>>2]|0;
   $177 = ((($176)) + 16|0);
   $25 = $177;
   $178 = $25;
   $24 = $178;
   $179 = $24;
   $180 = ((($179)) + 4|0);
   $41 = $180;
   $181 = $41;
   $39 = $181;
   $182 = $39;
   $37 = $182;
   $183 = $37;
   $184 = ((($183)) + 4|0);
   $36 = $184;
   $185 = $36;
   $35 = $185;
   $186 = $35;
   $34 = $186;
   $187 = $34;
   $33 = $187;
   $188 = $33;
   $31 = $38;
   $32 = $188;
   $189 = $31;
   $190 = $32;
   HEAP32[$189>>2] = $190;
   $191 = HEAP32[$38>>2]|0;
   HEAP32[$42>>2] = $191;
   ;HEAP8[$30>>0]=HEAP8[$42>>0]|0;HEAP8[$30+1>>0]=HEAP8[$42+1>>0]|0;HEAP8[$30+2>>0]=HEAP8[$42+2>>0]|0;HEAP8[$30+3>>0]=HEAP8[$42+3>>0]|0;
   $29 = $40;
   $192 = $29;
   $193 = HEAP32[$30>>2]|0;
   HEAP32[$192>>2] = $193;
   $194 = HEAP32[$40>>2]|0;
   HEAP32[$116>>2] = $194;
   $45 = $114;
   $46 = $116;
   $195 = $45;
   $196 = $46;
   $43 = $195;
   $44 = $196;
   $197 = $43;
   $198 = HEAP32[$197>>2]|0;
   $199 = $44;
   $200 = HEAP32[$199>>2]|0;
   $201 = ($198|0)==($200|0);
   $202 = $201 ^ 1;
   if (!($202)) {
    break;
   }
   $203 = $109;
   $51 = $111;
   $204 = $51;
   $50 = $204;
   $205 = $50;
   $49 = $205;
   $206 = $49;
   $207 = HEAP32[$206>>2]|0;
   $208 = ((($207)) + 16|0);
   $48 = $208;
   $209 = $48;
   $47 = $209;
   $210 = $47;
   $211 = (__ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEixERS9_($203,$210)|0);
   $67 = $114;
   $212 = $67;
   $66 = $212;
   $213 = $66;
   $214 = HEAP32[$213>>2]|0;
   $215 = ((($214)) + 13|0);
   $85 = $211;
   $86 = $215;
   $216 = $85;
   $217 = $86;
   $82 = $216;
   $83 = $217;
   $218 = $82;
   $219 = $83;
   $80 = $219;
   $220 = $80;
   $221 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__emplace_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEEDpOT_($218,$220)|0);
   HEAP32[$81>>2] = $221;
   $222 = HEAP32[$81>>2]|0;
   HEAP32[$87>>2] = $222;
   ;HEAP8[$79>>0]=HEAP8[$87>>0]|0;HEAP8[$79+1>>0]=HEAP8[$87+1>>0]|0;HEAP8[$79+2>>0]=HEAP8[$87+2>>0]|0;HEAP8[$79+3>>0]=HEAP8[$87+3>>0]|0;
   $78 = $84;
   $223 = $78;
   $224 = HEAP32[$79>>2]|0;
   HEAP32[$223>>2] = $224;
   $225 = HEAP32[$84>>2]|0;
   HEAP32[$117>>2] = $225;
   $95 = $114;
   $96 = 0;
   $226 = $95;
   ;HEAP32[$94>>2]=HEAP32[$226>>2]|0;
   $93 = $226;
   $227 = $93;
   $228 = HEAP32[$227>>2]|0;
   $92 = $228;
   $229 = $92;
   $230 = ((($229)) + 4|0);
   $231 = HEAP32[$230>>2]|0;
   $232 = ($231|0)!=(0|0);
   if ($232) {
    $233 = $92;
    $234 = ((($233)) + 4|0);
    $235 = HEAP32[$234>>2]|0;
    $90 = $235;
    while(1) {
     $236 = $90;
     $237 = HEAP32[$236>>2]|0;
     $238 = ($237|0)!=(0|0);
     $239 = $90;
     if (!($238)) {
      break;
     }
     $240 = HEAP32[$239>>2]|0;
     $90 = $240;
    }
    $91 = $239;
   } else {
    while(1) {
     $241 = $92;
     $89 = $241;
     $242 = $89;
     $243 = $89;
     $244 = ((($243)) + 8|0);
     $245 = HEAP32[$244>>2]|0;
     $246 = HEAP32[$245>>2]|0;
     $247 = ($242|0)==($246|0);
     $248 = $247 ^ 1;
     $249 = $92;
     if (!($248)) {
      break;
     }
     $88 = $249;
     $250 = $88;
     $251 = ((($250)) + 8|0);
     $252 = HEAP32[$251>>2]|0;
     $92 = $252;
    }
    $253 = ((($249)) + 8|0);
    $254 = HEAP32[$253>>2]|0;
    $91 = $254;
   }
   $255 = $91;
   HEAP32[$227>>2] = $255;
   $256 = HEAP32[$94>>2]|0;
   HEAP32[$118>>2] = $256;
  }
  $105 = $111;
  $106 = 0;
  $257 = $105;
  ;HEAP32[$104>>2]=HEAP32[$257>>2]|0;
  $103 = $257;
  $258 = $103;
  $102 = $258;
  $259 = $102;
  $260 = HEAP32[$259>>2]|0;
  $101 = $260;
  $261 = $101;
  $262 = ((($261)) + 4|0);
  $263 = HEAP32[$262>>2]|0;
  $264 = ($263|0)!=(0|0);
  if ($264) {
   $265 = $101;
   $266 = ((($265)) + 4|0);
   $267 = HEAP32[$266>>2]|0;
   $99 = $267;
   while(1) {
    $268 = $99;
    $269 = HEAP32[$268>>2]|0;
    $270 = ($269|0)!=(0|0);
    $271 = $99;
    if (!($270)) {
     break;
    }
    $272 = HEAP32[$271>>2]|0;
    $99 = $272;
   }
   $100 = $271;
  } else {
   while(1) {
    $273 = $101;
    $98 = $273;
    $274 = $98;
    $275 = $98;
    $276 = ((($275)) + 8|0);
    $277 = HEAP32[$276>>2]|0;
    $278 = HEAP32[$277>>2]|0;
    $279 = ($274|0)==($278|0);
    $280 = $279 ^ 1;
    $281 = $101;
    if (!($280)) {
     break;
    }
    $97 = $281;
    $282 = $97;
    $283 = ((($282)) + 8|0);
    $284 = HEAP32[$283>>2]|0;
    $101 = $284;
   }
   $285 = ((($281)) + 8|0);
   $286 = HEAP32[$285>>2]|0;
   $100 = $286;
  }
  $287 = $100;
  HEAP32[$259>>2] = $287;
  $288 = HEAP32[$104>>2]|0;
  HEAP32[$119>>2] = $288;
 }
 STACKTOP = sp;return 0;
}
function __Z14wildCardsToStri($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $11 = sp + 40|0;
 $10 = $1;
 $$expand_i1_val = 0;
 HEAP8[$11>>0] = $$expand_i1_val;
 $8 = $0;
 $9 = 8264;
 $13 = $8;
 $7 = $13;
 $14 = $7;
 $6 = $14;
 $15 = $6;
 ;HEAP32[$15>>2]=0|0;HEAP32[$15+4>>2]=0|0;HEAP32[$15+8>>2]=0|0;
 $5 = $14;
 $16 = $5;
 $4 = $16;
 $17 = $9;
 $18 = $9;
 $19 = (__ZNSt3__211char_traitsIcE6lengthEPKc($18)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($13,$17,$19);
 $12 = 0;
 while(1) {
  $20 = $12;
  $21 = $10;
  $22 = ($20|0)<($21|0);
  if (!($22)) {
   break;
  }
  $2 = $0;
  $3 = 3865;
  $23 = $2;
  $24 = $3;
  (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($23,$24)|0);
  $25 = $12;
  $26 = (($25) + 1)|0;
  $12 = $26;
 }
 $$expand_i1_val2 = 1;
 HEAP8[$11>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$11>>0]|0;
 $27 = $$pre_trunc&1;
 if ($27) {
  STACKTOP = sp;return;
 }
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($0);
 STACKTOP = sp;return;
}
function __Z9handToStrNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEi($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0;
 var $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0;
 var $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0;
 var $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0;
 var $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0;
 var $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0;
 var $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0;
 var $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0;
 var $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0;
 var $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0;
 var $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0;
 var $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0;
 var $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0;
 var $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0;
 var $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0;
 var $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0;
 var $459 = 0, $46 = 0, $460 = 0, $461 = 0, $462 = 0, $463 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0;
 var $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0;
 var $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0;
 var $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 768|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(768|0);
 $9 = sp + 24|0;
 $17 = sp + 704|0;
 $19 = sp + 696|0;
 $21 = sp + 688|0;
 $34 = sp + 16|0;
 $38 = sp + 624|0;
 $40 = sp + 616|0;
 $42 = sp + 608|0;
 $94 = sp + 404|0;
 $104 = sp + 364|0;
 $114 = sp + 8|0;
 $122 = sp + 296|0;
 $124 = sp + 288|0;
 $126 = sp + 280|0;
 $156 = sp;
 $160 = sp + 148|0;
 $162 = sp + 140|0;
 $164 = sp + 132|0;
 $174 = sp + 760|0;
 $175 = sp + 92|0;
 $176 = sp + 88|0;
 $177 = sp + 84|0;
 $178 = sp + 80|0;
 $179 = sp + 76|0;
 $180 = sp + 72|0;
 $181 = sp + 60|0;
 $182 = sp + 48|0;
 $183 = sp + 44|0;
 $184 = sp + 40|0;
 $185 = sp + 28|0;
 $173 = $2;
 $$expand_i1_val = 0;
 HEAP8[$174>>0] = $$expand_i1_val;
 $171 = $0;
 $172 = 8264;
 $186 = $171;
 $170 = $186;
 $187 = $170;
 $169 = $187;
 $188 = $169;
 ;HEAP32[$188>>2]=0|0;HEAP32[$188+4>>2]=0|0;HEAP32[$188+8>>2]=0|0;
 $168 = $187;
 $189 = $168;
 $167 = $189;
 $190 = $172;
 $191 = $172;
 $192 = (__ZNSt3__211char_traitsIcE6lengthEPKc($191)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($186,$190,$192);
 $166 = $175;
 $193 = $166;
 $165 = $193;
 $163 = $1;
 $194 = $163;
 $161 = $194;
 $195 = $161;
 $159 = $195;
 $196 = $159;
 $197 = HEAP32[$196>>2]|0;
 $157 = $160;
 $158 = $197;
 $198 = $157;
 $199 = $158;
 HEAP32[$198>>2] = $199;
 $200 = HEAP32[$160>>2]|0;
 HEAP32[$164>>2] = $200;
 ;HEAP8[$156>>0]=HEAP8[$164>>0]|0;HEAP8[$156+1>>0]=HEAP8[$164+1>>0]|0;HEAP8[$156+2>>0]=HEAP8[$164+2>>0]|0;HEAP8[$156+3>>0]=HEAP8[$164+3>>0]|0;
 $155 = $162;
 $201 = $155;
 ;HEAP32[$201>>2]=HEAP32[$156>>2]|0;
 $202 = HEAP32[$162>>2]|0;
 HEAP32[$176>>2] = $202;
 ;HEAP32[$175>>2]=HEAP32[$176>>2]|0;
 while(1) {
  $125 = $1;
  $203 = $125;
  $123 = $203;
  $204 = $123;
  $121 = $204;
  $205 = $121;
  $206 = ((($205)) + 4|0);
  $120 = $206;
  $207 = $120;
  $119 = $207;
  $208 = $119;
  $118 = $208;
  $209 = $118;
  $117 = $209;
  $210 = $117;
  $115 = $122;
  $116 = $210;
  $211 = $115;
  $212 = $116;
  HEAP32[$211>>2] = $212;
  $213 = HEAP32[$122>>2]|0;
  HEAP32[$126>>2] = $213;
  ;HEAP8[$114>>0]=HEAP8[$126>>0]|0;HEAP8[$114+1>>0]=HEAP8[$126+1>>0]|0;HEAP8[$114+2>>0]=HEAP8[$126+2>>0]|0;HEAP8[$114+3>>0]=HEAP8[$126+3>>0]|0;
  $113 = $124;
  $214 = $113;
  ;HEAP32[$214>>2]=HEAP32[$114>>2]|0;
  $215 = HEAP32[$124>>2]|0;
  HEAP32[$177>>2] = $215;
  $111 = $175;
  $112 = $177;
  $216 = $111;
  $217 = $112;
  $109 = $216;
  $110 = $217;
  $218 = $109;
  $219 = $110;
  $107 = $218;
  $108 = $219;
  $220 = $107;
  $221 = HEAP32[$220>>2]|0;
  $222 = $108;
  $223 = HEAP32[$222>>2]|0;
  $224 = ($221|0)==($223|0);
  $225 = $224 ^ 1;
  if (!($225)) {
   break;
  }
  $59 = $178;
  $47 = $175;
  $226 = $47;
  $46 = $226;
  $227 = $46;
  $45 = $227;
  $228 = $45;
  $229 = HEAP32[$228>>2]|0;
  $230 = ((($229)) + 16|0);
  $44 = $230;
  $231 = $44;
  $43 = $231;
  $232 = $43;
  $233 = ((($232)) + 4|0);
  $41 = $233;
  $234 = $41;
  $39 = $234;
  $235 = $39;
  $37 = $235;
  $236 = $37;
  $237 = HEAP32[$236>>2]|0;
  $35 = $38;
  $36 = $237;
  $238 = $35;
  $239 = $36;
  HEAP32[$238>>2] = $239;
  $240 = HEAP32[$38>>2]|0;
  HEAP32[$42>>2] = $240;
  ;HEAP8[$34>>0]=HEAP8[$42>>0]|0;HEAP8[$34+1>>0]=HEAP8[$42+1>>0]|0;HEAP8[$34+2>>0]=HEAP8[$42+2>>0]|0;HEAP8[$34+3>>0]=HEAP8[$42+3>>0]|0;
  $33 = $40;
  $241 = $33;
  $242 = HEAP32[$34>>2]|0;
  HEAP32[$241>>2] = $242;
  $243 = HEAP32[$40>>2]|0;
  HEAP32[$179>>2] = $243;
  ;HEAP32[$178>>2]=HEAP32[$179>>2]|0;
  while(1) {
   $7 = $175;
   $244 = $7;
   $6 = $244;
   $245 = $6;
   $5 = $245;
   $246 = $5;
   $247 = HEAP32[$246>>2]|0;
   $248 = ((($247)) + 16|0);
   $4 = $248;
   $249 = $4;
   $3 = $249;
   $250 = $3;
   $251 = ((($250)) + 4|0);
   $20 = $251;
   $252 = $20;
   $18 = $252;
   $253 = $18;
   $16 = $253;
   $254 = $16;
   $255 = ((($254)) + 4|0);
   $15 = $255;
   $256 = $15;
   $14 = $256;
   $257 = $14;
   $13 = $257;
   $258 = $13;
   $12 = $258;
   $259 = $12;
   $10 = $17;
   $11 = $259;
   $260 = $10;
   $261 = $11;
   HEAP32[$260>>2] = $261;
   $262 = HEAP32[$17>>2]|0;
   HEAP32[$21>>2] = $262;
   ;HEAP8[$9>>0]=HEAP8[$21>>0]|0;HEAP8[$9+1>>0]=HEAP8[$21+1>>0]|0;HEAP8[$9+2>>0]=HEAP8[$21+2>>0]|0;HEAP8[$9+3>>0]=HEAP8[$21+3>>0]|0;
   $8 = $19;
   $263 = $8;
   $264 = HEAP32[$9>>2]|0;
   HEAP32[$263>>2] = $264;
   $265 = HEAP32[$19>>2]|0;
   HEAP32[$180>>2] = $265;
   $24 = $178;
   $25 = $180;
   $266 = $24;
   $267 = $25;
   $22 = $266;
   $23 = $267;
   $268 = $22;
   $269 = HEAP32[$268>>2]|0;
   $270 = $23;
   $271 = HEAP32[$270>>2]|0;
   $272 = ($269|0)==($271|0);
   $273 = $272 ^ 1;
   if (!($273)) {
    break;
   }
   $30 = $175;
   $274 = $30;
   $29 = $274;
   $275 = $29;
   $28 = $275;
   $276 = $28;
   $277 = HEAP32[$276>>2]|0;
   $278 = ((($277)) + 16|0);
   $27 = $278;
   $279 = $27;
   $26 = $279;
   $280 = $26;
   $281 = HEAP32[$280>>2]|0;
   $32 = $178;
   $282 = $32;
   $31 = $282;
   $283 = $31;
   $284 = HEAP32[$283>>2]|0;
   $285 = ((($284)) + 13|0);
   $286 = HEAP8[$285>>0]|0;
   __Z9CardToStric($182,$281,$286);
   $57 = $182;
   $58 = 32;
   $287 = $57;
   $288 = $58;
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc($287,$288);
   $289 = $57;
   $56 = $289;
   $290 = $56;
   $54 = $181;
   $55 = $290;
   $291 = $54;
   $292 = $55;
   $53 = $292;
   $293 = $53;
   ;HEAP32[$291>>2]=HEAP32[$293>>2]|0;HEAP32[$291+4>>2]=HEAP32[$293+4>>2]|0;HEAP32[$291+8>>2]=HEAP32[$293+8>>2]|0;
   $294 = $55;
   $50 = $294;
   $295 = $50;
   $49 = $295;
   $296 = $49;
   $48 = $296;
   $297 = $48;
   $51 = $297;
   $52 = 0;
   while(1) {
    $298 = $52;
    $299 = ($298>>>0)<(3);
    if (!($299)) {
     break;
    }
    $300 = $51;
    $301 = $52;
    $302 = (($300) + ($301<<2)|0);
    HEAP32[$302>>2] = 0;
    $303 = $52;
    $304 = (($303) + 1)|0;
    $52 = $304;
   }
   $86 = $0;
   $87 = $181;
   $305 = $86;
   $306 = $87;
   $84 = $305;
   $85 = $306;
   $307 = $84;
   $308 = $85;
   $83 = $308;
   $309 = $83;
   $82 = $309;
   $310 = $82;
   $81 = $310;
   $311 = $81;
   $80 = $311;
   $312 = $80;
   $79 = $312;
   $313 = $79;
   $314 = ((($313)) + 11|0);
   $315 = HEAP8[$314>>0]|0;
   $316 = $315&255;
   $317 = $316 & 128;
   $318 = ($317|0)!=(0);
   if ($318) {
    $73 = $310;
    $319 = $73;
    $72 = $319;
    $320 = $72;
    $71 = $320;
    $321 = $71;
    $322 = HEAP32[$321>>2]|0;
    $328 = $322;
   } else {
    $78 = $310;
    $323 = $78;
    $77 = $323;
    $324 = $77;
    $76 = $324;
    $325 = $76;
    $75 = $325;
    $326 = $75;
    $74 = $326;
    $327 = $74;
    $328 = $327;
   }
   $70 = $328;
   $329 = $70;
   $330 = $85;
   $69 = $330;
   $331 = $69;
   $68 = $331;
   $332 = $68;
   $67 = $332;
   $333 = $67;
   $66 = $333;
   $334 = $66;
   $335 = ((($334)) + 11|0);
   $336 = HEAP8[$335>>0]|0;
   $337 = $336&255;
   $338 = $337 & 128;
   $339 = ($338|0)!=(0);
   if ($339) {
    $62 = $331;
    $340 = $62;
    $61 = $340;
    $341 = $61;
    $60 = $341;
    $342 = $60;
    $343 = ((($342)) + 4|0);
    $344 = HEAP32[$343>>2]|0;
    $351 = $344;
   } else {
    $65 = $331;
    $345 = $65;
    $64 = $345;
    $346 = $64;
    $63 = $346;
    $347 = $63;
    $348 = ((($347)) + 11|0);
    $349 = HEAP8[$348>>0]|0;
    $350 = $349&255;
    $351 = $350;
   }
   (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm($307,$329,$351)|0);
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($181);
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($182);
   $95 = $178;
   $96 = 0;
   $352 = $95;
   ;HEAP32[$94>>2]=HEAP32[$352>>2]|0;
   $93 = $352;
   $353 = $93;
   $354 = HEAP32[$353>>2]|0;
   $92 = $354;
   $355 = $92;
   $356 = ((($355)) + 4|0);
   $357 = HEAP32[$356>>2]|0;
   $358 = ($357|0)!=(0|0);
   if ($358) {
    $359 = $92;
    $360 = ((($359)) + 4|0);
    $361 = HEAP32[$360>>2]|0;
    $90 = $361;
    while(1) {
     $362 = $90;
     $363 = HEAP32[$362>>2]|0;
     $364 = ($363|0)!=(0|0);
     $365 = $90;
     if (!($364)) {
      break;
     }
     $366 = HEAP32[$365>>2]|0;
     $90 = $366;
    }
    $91 = $365;
   } else {
    while(1) {
     $367 = $92;
     $89 = $367;
     $368 = $89;
     $369 = $89;
     $370 = ((($369)) + 8|0);
     $371 = HEAP32[$370>>2]|0;
     $372 = HEAP32[$371>>2]|0;
     $373 = ($368|0)==($372|0);
     $374 = $373 ^ 1;
     $375 = $92;
     if (!($374)) {
      break;
     }
     $88 = $375;
     $376 = $88;
     $377 = ((($376)) + 8|0);
     $378 = HEAP32[$377>>2]|0;
     $92 = $378;
    }
    $379 = ((($375)) + 8|0);
    $380 = HEAP32[$379>>2]|0;
    $91 = $380;
   }
   $381 = $91;
   HEAP32[$353>>2] = $381;
   $382 = HEAP32[$94>>2]|0;
   HEAP32[$183>>2] = $382;
  }
  $105 = $175;
  $106 = 0;
  $383 = $105;
  ;HEAP32[$104>>2]=HEAP32[$383>>2]|0;
  $103 = $383;
  $384 = $103;
  $102 = $384;
  $385 = $102;
  $386 = HEAP32[$385>>2]|0;
  $101 = $386;
  $387 = $101;
  $388 = ((($387)) + 4|0);
  $389 = HEAP32[$388>>2]|0;
  $390 = ($389|0)!=(0|0);
  if ($390) {
   $391 = $101;
   $392 = ((($391)) + 4|0);
   $393 = HEAP32[$392>>2]|0;
   $99 = $393;
   while(1) {
    $394 = $99;
    $395 = HEAP32[$394>>2]|0;
    $396 = ($395|0)!=(0|0);
    $397 = $99;
    if (!($396)) {
     break;
    }
    $398 = HEAP32[$397>>2]|0;
    $99 = $398;
   }
   $100 = $397;
  } else {
   while(1) {
    $399 = $101;
    $98 = $399;
    $400 = $98;
    $401 = $98;
    $402 = ((($401)) + 8|0);
    $403 = HEAP32[$402>>2]|0;
    $404 = HEAP32[$403>>2]|0;
    $405 = ($400|0)==($404|0);
    $406 = $405 ^ 1;
    $407 = $101;
    if (!($406)) {
     break;
    }
    $97 = $407;
    $408 = $97;
    $409 = ((($408)) + 8|0);
    $410 = HEAP32[$409>>2]|0;
    $101 = $410;
   }
   $411 = ((($407)) + 8|0);
   $412 = HEAP32[$411>>2]|0;
   $100 = $412;
  }
  $413 = $100;
  HEAP32[$385>>2] = $413;
  $414 = HEAP32[$104>>2]|0;
  HEAP32[$184>>2] = $414;
 }
 $415 = $173;
 __Z14wildCardsToStri($185,$415);
 $153 = $0;
 $154 = $185;
 $416 = $153;
 $417 = $154;
 $151 = $416;
 $152 = $417;
 $418 = $151;
 $419 = $152;
 $150 = $419;
 $420 = $150;
 $149 = $420;
 $421 = $149;
 $148 = $421;
 $422 = $148;
 $147 = $422;
 $423 = $147;
 $146 = $423;
 $424 = $146;
 $425 = ((($424)) + 11|0);
 $426 = HEAP8[$425>>0]|0;
 $427 = $426&255;
 $428 = $427 & 128;
 $429 = ($428|0)!=(0);
 if ($429) {
  $140 = $421;
  $430 = $140;
  $139 = $430;
  $431 = $139;
  $138 = $431;
  $432 = $138;
  $433 = HEAP32[$432>>2]|0;
  $439 = $433;
 } else {
  $145 = $421;
  $434 = $145;
  $144 = $434;
  $435 = $144;
  $143 = $435;
  $436 = $143;
  $142 = $436;
  $437 = $142;
  $141 = $437;
  $438 = $141;
  $439 = $438;
 }
 $137 = $439;
 $440 = $137;
 $441 = $152;
 $136 = $441;
 $442 = $136;
 $135 = $442;
 $443 = $135;
 $134 = $443;
 $444 = $134;
 $133 = $444;
 $445 = $133;
 $446 = ((($445)) + 11|0);
 $447 = HEAP8[$446>>0]|0;
 $448 = $447&255;
 $449 = $448 & 128;
 $450 = ($449|0)!=(0);
 if ($450) {
  $129 = $442;
  $451 = $129;
  $128 = $451;
  $452 = $128;
  $127 = $452;
  $453 = $127;
  $454 = ((($453)) + 4|0);
  $455 = HEAP32[$454>>2]|0;
  $462 = $455;
 } else {
  $132 = $442;
  $456 = $132;
  $131 = $456;
  $457 = $131;
  $130 = $457;
  $458 = $130;
  $459 = ((($458)) + 11|0);
  $460 = HEAP8[$459>>0]|0;
  $461 = $460&255;
  $462 = $461;
 }
 (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm($418,$440,$462)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($185);
 $$expand_i1_val2 = 1;
 HEAP8[$174>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$174>>0]|0;
 $463 = $$pre_trunc&1;
 if ($463) {
  STACKTOP = sp;return;
 }
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($0);
 STACKTOP = sp;return;
}
function __Z17tryExtractOneHandciiRiiS_RNSt3__23mapIiNS0_8multisetIcNS0_4lessIcEENS0_9allocatorIcEEEENS3_IiEENS5_INS0_4pairIKiS7_EEEEEEiRNS0_4listINS0_12basic_stringIcNS0_11char_traitsIcEES6_EENS5_ISJ_EEEES_($0,$1,$2,$3,$4,$5,$6,$7,$8,$9) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 $6 = $6|0;
 $7 = $7|0;
 $8 = $8|0;
 $9 = $9|0;
 var $$byval_copy = 0, $$byval_copy2 = 0, $$byval_copy3 = 0, $$byval_copy4 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0;
 var $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0;
 var $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0;
 var $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0;
 var $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0;
 var $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0;
 var $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0;
 var $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0;
 var $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0;
 var $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0;
 var $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0;
 var $296 = 0, $297 = 0, $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0;
 var $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0;
 var $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0;
 var $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0;
 var $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0;
 var $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0;
 var $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0;
 var $423 = 0, $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0;
 var $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0;
 var $46 = 0, $460 = 0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0;
 var $478 = 0, $479 = 0, $48 = 0, $480 = 0, $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0;
 var $496 = 0, $497 = 0, $498 = 0, $499 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0;
 var $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0;
 var $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0;
 var $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0;
 var $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0;
 var $587 = 0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0;
 var $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $70 = 0, $71 = 0;
 var $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $90 = 0, $91 = 0;
 var $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 1104|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(1104|0);
 $$byval_copy4 = sp + 1096|0;
 $$byval_copy3 = sp + 1092|0;
 $$byval_copy2 = sp + 1088|0;
 $$byval_copy = sp + 1084|0;
 $19 = sp + 1044|0;
 $21 = sp + 1036|0;
 $27 = sp + 1012|0;
 $29 = sp + 1004|0;
 $40 = sp + 960|0;
 $42 = sp + 952|0;
 $45 = sp + 940|0;
 $104 = sp + 72|0;
 $117 = sp + 64|0;
 $119 = sp + 652|0;
 $122 = sp + 640|0;
 $123 = sp + 56|0;
 $124 = sp + 636|0;
 $127 = sp + 624|0;
 $128 = sp + 620|0;
 $129 = sp + 48|0;
 $138 = sp + 40|0;
 $146 = sp + 556|0;
 $148 = sp + 548|0;
 $150 = sp + 540|0;
 $151 = sp + 536|0;
 $154 = sp + 524|0;
 $155 = sp + 520|0;
 $156 = sp + 516|0;
 $157 = sp + 512|0;
 $158 = sp + 32|0;
 $159 = sp + 24|0;
 $161 = sp + 16|0;
 $169 = sp + 476|0;
 $171 = sp + 468|0;
 $173 = sp + 460|0;
 $175 = sp + 8|0;
 $179 = sp + 440|0;
 $181 = sp + 432|0;
 $183 = sp + 424|0;
 $186 = sp + 412|0;
 $187 = sp + 408|0;
 $199 = sp + 360|0;
 $201 = sp + 352|0;
 $205 = sp + 336|0;
 $207 = sp + 328|0;
 $228 = sp + 244|0;
 $231 = sp;
 $233 = sp + 1103|0;
 $234 = sp + 1102|0;
 $246 = sp + 180|0;
 $247 = sp + 176|0;
 $249 = sp + 164|0;
 $251 = sp + 156|0;
 $252 = sp + 152|0;
 $253 = sp + 140|0;
 $254 = sp + 128|0;
 $255 = sp + 116|0;
 $256 = sp + 104|0;
 $257 = sp + 100|0;
 $258 = sp + 96|0;
 $259 = sp + 92|0;
 $260 = sp + 88|0;
 $261 = sp + 84|0;
 $262 = sp + 80|0;
 $263 = sp + 76|0;
 $235 = $0;
 $236 = $1;
 $237 = $2;
 $238 = $3;
 $239 = $4;
 $240 = $5;
 $241 = $6;
 $242 = $7;
 $243 = $8;
 $244 = $9;
 $264 = $238;
 $265 = HEAP32[$264>>2]|0;
 $266 = (($265) + 1)|0;
 HEAP32[$264>>2] = $266;
 $267 = $239;
 $268 = $238;
 $269 = HEAP32[$268>>2]|0;
 $270 = ($267|0)>($269|0);
 if ($270) {
  STACKTOP = sp;return;
 }
 $271 = $239;
 $272 = $238;
 $273 = HEAP32[$272>>2]|0;
 $274 = ($271|0)<($273|0);
 if ($274) {
  $275 = $240;
  HEAP32[$275>>2] = 0;
 }
 $276 = $240;
 $277 = HEAP32[$276>>2]|0;
 $245 = $277;
 while(1) {
  $278 = $245;
  $279 = $236;
  $280 = (($278) + ($279))|0;
  $281 = (($280) - 1)|0;
  $282 = ($281|0)<=(14);
  if (!($282)) {
   break;
  }
  $232 = $246;
  $283 = $232;
  ;HEAP8[$231>>0]=HEAP8[$234>>0]|0;
  $230 = $233;
  __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSB_($283,$233);
  HEAP32[$247>>2] = 0;
  $284 = $241;
  $285 = $242;
  $286 = $245;
  $287 = $236;
  $288 = $237;
  $289 = $235;
  $290 = (__Z11ExistShunZiRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEiiiicSD_Ri($284,$285,$286,$287,$288,$289,$246,$247)|0);
  $291 = $290&1;
  $248 = $291;
  $292 = $248;
  $293 = $292&1;
  if ($293) {
   $294 = $241;
   (__Z3ChuRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEESD_($294,$246)|0);
   $229 = $249;
   $295 = $229;
   $227 = $295;
   $296 = $227;
   $226 = $296;
   $297 = $226;
   $225 = $297;
   $298 = $225;
   $224 = $298;
   $299 = $224;
   $223 = $299;
   $300 = $223;
   $218 = $300;
   $301 = $218;
   HEAP32[$297>>2] = $301;
   $302 = ((($297)) + 4|0);
   $221 = $297;
   $303 = $221;
   $220 = $303;
   $304 = $220;
   $219 = $304;
   $305 = $219;
   $222 = $305;
   $306 = $222;
   HEAP32[$302>>2] = $306;
   $307 = ((($296)) + 8|0);
   HEAP32[$228>>2] = 0;
   $216 = $307;
   $217 = $228;
   $308 = $216;
   $309 = $217;
   $215 = $309;
   $310 = $215;
   $211 = $308;
   $212 = $310;
   $311 = $211;
   $312 = $212;
   $210 = $312;
   $313 = $210;
   $314 = HEAP32[$313>>2]|0;
   HEAP32[$311>>2] = $314;
   $214 = $308;
   $315 = $214;
   $213 = $315;
   $316 = $241;
   $317 = $242;
   $318 = HEAP32[$247>>2]|0;
   $319 = (($317) - ($318))|0;
   $320 = $238;
   $321 = HEAP32[$320>>2]|0;
   $322 = $245;
   $323 = (__Z5checkRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEERNS_4listINS_12basic_stringIcNS_11char_traitsIcEES5_EENS4_ISI_EEEEiii($316,$249,$319,$321,$322)|0);
   $324 = $235;
   $325 = $324 << 24 >> 24;
   $326 = ($325|0)!=(65);
   $327 = $236;
   $328 = ($327|0)==(5);
   $or$cond = $326 & $328;
   if ($or$cond) {
    $329 = $237;
    $330 = ($329|0)==(1);
    $331 = $330;
   } else {
    $331 = 0;
   }
   $332 = $331 ? 0 : 1;
   $333 = (($323) + ($332))|0;
   $250 = $333;
   $334 = $250;
   $335 = $244;
   $336 = HEAP32[$335>>2]|0;
   $337 = ($334|0)<=($336|0);
   if ($337) {
    $338 = $250;
    $339 = $244;
    $340 = HEAP32[$339>>2]|0;
    $341 = ($338|0)<($340|0);
    if ($341) {
     $342 = $243;
     $209 = $342;
     $343 = $209;
     __ZNSt3__210__list_impINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE5clearEv($343);
    }
    $344 = $250;
    $345 = $244;
    HEAP32[$345>>2] = $344;
    $208 = $249;
    $346 = $208;
    $206 = $346;
    $347 = $206;
    $348 = ((($347)) + 4|0);
    $349 = HEAP32[$348>>2]|0;
    $203 = $205;
    $204 = $349;
    $350 = $203;
    $351 = $204;
    HEAP32[$350>>2] = $351;
    $352 = HEAP32[$205>>2]|0;
    HEAP32[$207>>2] = $352;
    $353 = HEAP32[$207>>2]|0;
    HEAP32[$251>>2] = $353;
    while(1) {
     $202 = $249;
     $354 = $202;
     $200 = $354;
     $355 = $200;
     $198 = $355;
     $356 = $198;
     $197 = $356;
     $357 = $197;
     $196 = $357;
     $358 = $196;
     $195 = $358;
     $359 = $195;
     $194 = $359;
     $360 = $194;
     $192 = $199;
     $193 = $360;
     $361 = $192;
     $362 = $193;
     HEAP32[$361>>2] = $362;
     $363 = HEAP32[$199>>2]|0;
     HEAP32[$201>>2] = $363;
     $364 = HEAP32[$201>>2]|0;
     HEAP32[$252>>2] = $364;
     $190 = $251;
     $191 = $252;
     $365 = $190;
     $366 = $191;
     $188 = $365;
     $189 = $366;
     $367 = $188;
     $368 = HEAP32[$367>>2]|0;
     $369 = $189;
     $370 = HEAP32[$369>>2]|0;
     $371 = ($368|0)==($370|0);
     $372 = $371 ^ 1;
     if (!($372)) {
      break;
     }
     $184 = $256;
     $185 = $246;
     $373 = $184;
     $374 = $185;
     __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSD_($373,$374);
     $375 = $185;
     $182 = $375;
     $376 = $182;
     $180 = $376;
     $377 = $180;
     $178 = $377;
     $378 = $178;
     $379 = HEAP32[$378>>2]|0;
     $176 = $179;
     $177 = $379;
     $380 = $176;
     $381 = $177;
     HEAP32[$380>>2] = $381;
     $382 = HEAP32[$179>>2]|0;
     HEAP32[$183>>2] = $382;
     ;HEAP8[$175>>0]=HEAP8[$183>>0]|0;HEAP8[$175+1>>0]=HEAP8[$183+1>>0]|0;HEAP8[$175+2>>0]=HEAP8[$183+2>>0]|0;HEAP8[$175+3>>0]=HEAP8[$183+3>>0]|0;
     $174 = $181;
     $383 = $174;
     ;HEAP32[$383>>2]=HEAP32[$175>>2]|0;
     $384 = HEAP32[$181>>2]|0;
     HEAP32[$186>>2] = $384;
     $385 = $185;
     $172 = $385;
     $386 = $172;
     $170 = $386;
     $387 = $170;
     $168 = $387;
     $388 = $168;
     $389 = ((($388)) + 4|0);
     $167 = $389;
     $390 = $167;
     $166 = $390;
     $391 = $166;
     $165 = $391;
     $392 = $165;
     $164 = $392;
     $393 = $164;
     $162 = $169;
     $163 = $393;
     $394 = $162;
     $395 = $163;
     HEAP32[$394>>2] = $395;
     $396 = HEAP32[$169>>2]|0;
     HEAP32[$173>>2] = $396;
     ;HEAP8[$161>>0]=HEAP8[$173>>0]|0;HEAP8[$161+1>>0]=HEAP8[$173+1>>0]|0;HEAP8[$161+2>>0]=HEAP8[$173+2>>0]|0;HEAP8[$161+3>>0]=HEAP8[$173+3>>0]|0;
     $160 = $171;
     $397 = $160;
     ;HEAP32[$397>>2]=HEAP32[$161>>2]|0;
     $398 = HEAP32[$171>>2]|0;
     HEAP32[$187>>2] = $398;
     ;HEAP8[$158>>0]=HEAP8[$187>>0]|0;HEAP8[$158+1>>0]=HEAP8[$187+1>>0]|0;HEAP8[$158+2>>0]=HEAP8[$187+2>>0]|0;HEAP8[$158+3>>0]=HEAP8[$187+3>>0]|0;
     ;HEAP8[$159>>0]=HEAP8[$186>>0]|0;HEAP8[$159+1>>0]=HEAP8[$186+1>>0]|0;HEAP8[$159+2>>0]=HEAP8[$186+2>>0]|0;HEAP8[$159+3>>0]=HEAP8[$186+3>>0]|0;
     $153 = $373;
     $399 = $153;
     $152 = $399;
     $400 = $152;
     $149 = $400;
     $401 = $149;
     $147 = $401;
     $402 = $147;
     $145 = $402;
     $403 = $145;
     $404 = ((($403)) + 4|0);
     $144 = $404;
     $405 = $144;
     $143 = $405;
     $406 = $143;
     $142 = $406;
     $407 = $142;
     $141 = $407;
     $408 = $141;
     $139 = $146;
     $140 = $408;
     $409 = $139;
     $410 = $140;
     HEAP32[$409>>2] = $410;
     $411 = HEAP32[$146>>2]|0;
     HEAP32[$150>>2] = $411;
     ;HEAP8[$138>>0]=HEAP8[$150>>0]|0;HEAP8[$138+1>>0]=HEAP8[$150+1>>0]|0;HEAP8[$138+2>>0]=HEAP8[$150+2>>0]|0;HEAP8[$138+3>>0]=HEAP8[$150+3>>0]|0;
     $137 = $148;
     $412 = $137;
     ;HEAP32[$412>>2]=HEAP32[$138>>2]|0;
     $413 = HEAP32[$148>>2]|0;
     HEAP32[$151>>2] = $413;
     $414 = HEAP32[$151>>2]|0;
     HEAP32[$154>>2] = $414;
     while(1) {
      $114 = $159;
      $115 = $158;
      $415 = $114;
      $416 = $115;
      $112 = $415;
      $113 = $416;
      $417 = $112;
      $418 = $113;
      $110 = $417;
      $111 = $418;
      $419 = $110;
      $420 = HEAP32[$419>>2]|0;
      $421 = $111;
      $422 = HEAP32[$421>>2]|0;
      $423 = ($420|0)==($422|0);
      $424 = $423 ^ 1;
      if (!($424)) {
       break;
      }
      ;HEAP32[$156>>2]=HEAP32[$154>>2]|0;
      ;HEAP8[$104>>0]=HEAP8[$156>>0]|0;HEAP8[$104+1>>0]=HEAP8[$156+1>>0]|0;HEAP8[$104+2>>0]=HEAP8[$156+2>>0]|0;HEAP8[$104+3>>0]=HEAP8[$156+3>>0]|0;
      $103 = $155;
      $425 = $103;
      ;HEAP32[$425>>2]=HEAP32[$104>>2]|0;
      $109 = $159;
      $426 = $109;
      $108 = $426;
      $427 = $108;
      $107 = $427;
      $428 = $107;
      $429 = HEAP32[$428>>2]|0;
      $430 = ((($429)) + 16|0);
      $106 = $430;
      $431 = $106;
      $105 = $431;
      $432 = $105;
      ;HEAP8[$129>>0]=HEAP8[$155>>0]|0;HEAP8[$129+1>>0]=HEAP8[$155+1>>0]|0;HEAP8[$129+2>>0]=HEAP8[$155+2>>0]|0;HEAP8[$129+3>>0]=HEAP8[$155+3>>0]|0;
      $125 = $399;
      $126 = $432;
      $433 = $125;
      ;HEAP32[$128>>2]=HEAP32[$129>>2]|0;
      $434 = $126;
      ;HEAP8[$123>>0]=HEAP8[$128>>0]|0;HEAP8[$123+1>>0]=HEAP8[$128+1>>0]|0;HEAP8[$123+2>>0]=HEAP8[$128+2>>0]|0;HEAP8[$123+3>>0]=HEAP8[$128+3>>0]|0;
      $120 = $433;
      $121 = $434;
      $435 = $120;
      ;HEAP32[$122>>2]=HEAP32[$123>>2]|0;
      $436 = $121;
      $118 = $436;
      $437 = $118;
      $438 = $121;
      ;HEAP32[$$byval_copy>>2]=HEAP32[$122>>2]|0;
      $439 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE30__emplace_hint_unique_key_argsIiJRKNS_4pairIKiS7_EEEEENS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEENS_21__tree_const_iteratorIS8_SO_lEERKT_DpOT0_($435,$$byval_copy,$437,$438)|0);
      HEAP32[$119>>2] = $439;
      $440 = HEAP32[$119>>2]|0;
      HEAP32[$127>>2] = $440;
      ;HEAP8[$117>>0]=HEAP8[$127>>0]|0;HEAP8[$117+1>>0]=HEAP8[$127+1>>0]|0;HEAP8[$117+2>>0]=HEAP8[$127+2>>0]|0;HEAP8[$117+3>>0]=HEAP8[$127+3>>0]|0;
      $116 = $124;
      $441 = $116;
      ;HEAP32[$441>>2]=HEAP32[$117>>2]|0;
      $442 = HEAP32[$124>>2]|0;
      HEAP32[$157>>2] = $442;
      $136 = $159;
      $443 = $136;
      $135 = $443;
      $444 = $135;
      $445 = HEAP32[$444>>2]|0;
      $134 = $445;
      $446 = $134;
      $447 = ((($446)) + 4|0);
      $448 = HEAP32[$447>>2]|0;
      $449 = ($448|0)!=(0|0);
      if ($449) {
       $450 = $134;
       $451 = ((($450)) + 4|0);
       $452 = HEAP32[$451>>2]|0;
       $132 = $452;
       while(1) {
        $453 = $132;
        $454 = HEAP32[$453>>2]|0;
        $455 = ($454|0)!=(0|0);
        $456 = $132;
        if (!($455)) {
         break;
        }
        $457 = HEAP32[$456>>2]|0;
        $132 = $457;
       }
       $133 = $456;
      } else {
       while(1) {
        $458 = $134;
        $131 = $458;
        $459 = $131;
        $460 = $131;
        $461 = ((($460)) + 8|0);
        $462 = HEAP32[$461>>2]|0;
        $463 = HEAP32[$462>>2]|0;
        $464 = ($459|0)==($463|0);
        $465 = $464 ^ 1;
        $466 = $134;
        if (!($465)) {
         break;
        }
        $130 = $466;
        $467 = $130;
        $468 = ((($467)) + 8|0);
        $469 = HEAP32[$468>>2]|0;
        $134 = $469;
       }
       $470 = ((($466)) + 8|0);
       $471 = HEAP32[$470>>2]|0;
       $133 = $471;
      }
      $472 = $133;
      HEAP32[$444>>2] = $472;
     }
     $473 = HEAP32[$247>>2]|0;
     __Z9handToStrNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEi($255,$256,$473);
     $101 = 3869;
     $102 = $255;
     $474 = $102;
     $475 = $101;
     $476 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKc($474,0,$475)|0);
     $100 = $476;
     $477 = $100;
     $98 = $254;
     $99 = $477;
     $478 = $98;
     $479 = $99;
     $97 = $479;
     $480 = $97;
     ;HEAP32[$478>>2]=HEAP32[$480>>2]|0;HEAP32[$478+4>>2]=HEAP32[$480+4>>2]|0;HEAP32[$478+8>>2]=HEAP32[$480+8>>2]|0;
     $481 = $99;
     $94 = $481;
     $482 = $94;
     $93 = $482;
     $483 = $93;
     $92 = $483;
     $484 = $92;
     $95 = $484;
     $96 = 0;
     while(1) {
      $485 = $96;
      $486 = ($485>>>0)<(3);
      if (!($486)) {
       break;
      }
      $487 = $95;
      $488 = $96;
      $489 = (($487) + ($488<<2)|0);
      HEAP32[$489>>2] = 0;
      $490 = $96;
      $491 = (($490) + 1)|0;
      $96 = $491;
     }
     $90 = $254;
     $91 = 3872;
     $492 = $90;
     $493 = $91;
     $494 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($492,$493)|0);
     $89 = $494;
     $495 = $89;
     $87 = $253;
     $88 = $495;
     $496 = $87;
     $497 = $88;
     $86 = $497;
     $498 = $86;
     ;HEAP32[$496>>2]=HEAP32[$498>>2]|0;HEAP32[$496+4>>2]=HEAP32[$498+4>>2]|0;HEAP32[$496+8>>2]=HEAP32[$498+8>>2]|0;
     $499 = $88;
     $83 = $499;
     $500 = $83;
     $82 = $500;
     $501 = $82;
     $81 = $501;
     $502 = $81;
     $84 = $502;
     $85 = 0;
     while(1) {
      $503 = $85;
      $504 = ($503>>>0)<(3);
      if (!($504)) {
       break;
      }
      $505 = $84;
      $506 = $85;
      $507 = (($505) + ($506<<2)|0);
      HEAP32[$507>>2] = 0;
      $508 = $85;
      $509 = (($508) + 1)|0;
      $85 = $509;
     }
     $80 = $251;
     $510 = $80;
     $511 = HEAP32[$510>>2]|0;
     $79 = $511;
     $512 = $79;
     $78 = $512;
     $513 = $78;
     $77 = $513;
     $514 = $77;
     $76 = $514;
     $515 = $76;
     $516 = ((($515)) + 8|0);
     $74 = $516;
     $75 = $253;
     $517 = $74;
     $518 = $75;
     $72 = $517;
     $73 = $518;
     $519 = $72;
     $520 = $73;
     $71 = $520;
     $521 = $71;
     $70 = $521;
     $522 = $70;
     $69 = $522;
     $523 = $69;
     $68 = $523;
     $524 = $68;
     $67 = $524;
     $525 = $67;
     $526 = ((($525)) + 11|0);
     $527 = HEAP8[$526>>0]|0;
     $528 = $527&255;
     $529 = $528 & 128;
     $530 = ($529|0)!=(0);
     if ($530) {
      $61 = $522;
      $531 = $61;
      $60 = $531;
      $532 = $60;
      $59 = $532;
      $533 = $59;
      $534 = HEAP32[$533>>2]|0;
      $540 = $534;
     } else {
      $66 = $522;
      $535 = $66;
      $65 = $535;
      $536 = $65;
      $64 = $536;
      $537 = $64;
      $63 = $537;
      $538 = $63;
      $62 = $538;
      $539 = $62;
      $540 = $539;
     }
     $58 = $540;
     $541 = $58;
     $542 = $73;
     $57 = $542;
     $543 = $57;
     $56 = $543;
     $544 = $56;
     $55 = $544;
     $545 = $55;
     $54 = $545;
     $546 = $54;
     $547 = ((($546)) + 11|0);
     $548 = HEAP8[$547>>0]|0;
     $549 = $548&255;
     $550 = $549 & 128;
     $551 = ($550|0)!=(0);
     if ($551) {
      $50 = $543;
      $552 = $50;
      $49 = $552;
      $553 = $49;
      $48 = $553;
      $554 = $48;
      $555 = ((($554)) + 4|0);
      $556 = HEAP32[$555>>2]|0;
      $563 = $556;
     } else {
      $53 = $543;
      $557 = $53;
      $52 = $557;
      $558 = $52;
      $51 = $558;
      $559 = $51;
      $560 = ((($559)) + 11|0);
      $561 = HEAP8[$560>>0]|0;
      $562 = $561&255;
      $563 = $562;
     }
     (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm($519,$541,$563)|0);
     __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($253);
     __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($254);
     __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($255);
     __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($256);
     $46 = $251;
     $47 = 0;
     $564 = $46;
     ;HEAP32[$45>>2]=HEAP32[$564>>2]|0;
     $44 = $564;
     $565 = $44;
     $566 = HEAP32[$565>>2]|0;
     $567 = ((($566)) + 4|0);
     $568 = HEAP32[$567>>2]|0;
     HEAP32[$565>>2] = $568;
     $569 = HEAP32[$45>>2]|0;
     HEAP32[$257>>2] = $569;
    }
    $570 = $243;
    $571 = $243;
    $43 = $571;
    $572 = $43;
    $41 = $572;
    $573 = $41;
    $39 = $573;
    $574 = $39;
    $38 = $574;
    $575 = $38;
    $37 = $575;
    $576 = $37;
    $36 = $576;
    $577 = $36;
    $35 = $577;
    $578 = $35;
    $33 = $40;
    $34 = $578;
    $579 = $33;
    $580 = $34;
    HEAP32[$579>>2] = $580;
    $581 = HEAP32[$40>>2]|0;
    HEAP32[$42>>2] = $581;
    $582 = HEAP32[$42>>2]|0;
    HEAP32[$259>>2] = $582;
    $31 = $258;
    $32 = $259;
    $583 = $31;
    $584 = $32;
    $585 = HEAP32[$584>>2]|0;
    HEAP32[$583>>2] = $585;
    $30 = $249;
    $586 = $30;
    $28 = $586;
    $587 = $28;
    $588 = ((($587)) + 4|0);
    $589 = HEAP32[$588>>2]|0;
    $25 = $27;
    $26 = $589;
    $590 = $25;
    $591 = $26;
    HEAP32[$590>>2] = $591;
    $592 = HEAP32[$27>>2]|0;
    HEAP32[$29>>2] = $592;
    $593 = HEAP32[$29>>2]|0;
    HEAP32[$261>>2] = $593;
    $23 = $260;
    $24 = $261;
    $594 = $23;
    $595 = $24;
    $596 = HEAP32[$595>>2]|0;
    HEAP32[$594>>2] = $596;
    $22 = $249;
    $597 = $22;
    $20 = $597;
    $598 = $20;
    $18 = $598;
    $599 = $18;
    $17 = $599;
    $600 = $17;
    $16 = $600;
    $601 = $16;
    $15 = $601;
    $602 = $15;
    $14 = $602;
    $603 = $14;
    $12 = $19;
    $13 = $603;
    $604 = $12;
    $605 = $13;
    HEAP32[$604>>2] = $605;
    $606 = HEAP32[$19>>2]|0;
    HEAP32[$21>>2] = $606;
    $607 = HEAP32[$21>>2]|0;
    HEAP32[$263>>2] = $607;
    $10 = $262;
    $11 = $263;
    $608 = $10;
    $609 = $11;
    $610 = HEAP32[$609>>2]|0;
    HEAP32[$608>>2] = $610;
    ;HEAP32[$$byval_copy2>>2]=HEAP32[$258>>2]|0;
    ;HEAP32[$$byval_copy3>>2]=HEAP32[$260>>2]|0;
    ;HEAP32[$$byval_copy4>>2]=HEAP32[$262>>2]|0;
    __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6spliceENS_21__list_const_iteratorIS6_PvEERS8_SB_SB_($570,$$byval_copy2,$249,$$byval_copy3,$$byval_copy4);
   }
   $611 = $241;
   (__Z2MoRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEESD_($611,$246)|0);
   __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($249);
  }
  __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($246);
  $612 = $245;
  $613 = (($612) + 1)|0;
  $245 = $613;
 }
 STACKTOP = sp;return;
}
function __Z5checkRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEERNS_4listINS_12basic_stringIcNS_11char_traitsIcEES5_EENS4_ISI_EEEEiii($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$byval_copy = 0, $$byval_copy1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0;
 var $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0;
 var $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0;
 var $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0;
 var $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0;
 var $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0;
 var $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0;
 var $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0;
 var $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0;
 var $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0;
 var $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0;
 var $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0;
 var $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0;
 var $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0;
 var $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0;
 var $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0;
 var $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0;
 var $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0;
 var $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0, $460 = 0;
 var $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0;
 var $48 = 0, $480 = 0, $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0;
 var $498 = 0, $499 = 0, $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0;
 var $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0;
 var $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0;
 var $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 1024|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(1024|0);
 $$byval_copy1 = sp + 1008|0;
 $$byval_copy = sp + 1004|0;
 $44 = sp + 136|0;
 $57 = sp + 128|0;
 $59 = sp + 792|0;
 $62 = sp + 780|0;
 $63 = sp + 120|0;
 $64 = sp + 776|0;
 $67 = sp + 764|0;
 $68 = sp + 760|0;
 $69 = sp + 112|0;
 $78 = sp + 104|0;
 $86 = sp + 696|0;
 $88 = sp + 688|0;
 $90 = sp + 680|0;
 $91 = sp + 676|0;
 $94 = sp + 664|0;
 $95 = sp + 660|0;
 $96 = sp + 656|0;
 $97 = sp + 652|0;
 $98 = sp + 96|0;
 $99 = sp + 88|0;
 $101 = sp + 80|0;
 $109 = sp + 616|0;
 $111 = sp + 608|0;
 $113 = sp + 600|0;
 $115 = sp + 72|0;
 $119 = sp + 580|0;
 $121 = sp + 572|0;
 $123 = sp + 564|0;
 $126 = sp + 552|0;
 $127 = sp + 548|0;
 $129 = sp + 64|0;
 $142 = sp + 56|0;
 $144 = sp + 488|0;
 $147 = sp + 476|0;
 $148 = sp + 48|0;
 $149 = sp + 472|0;
 $152 = sp + 460|0;
 $153 = sp + 456|0;
 $154 = sp + 40|0;
 $163 = sp + 32|0;
 $171 = sp + 392|0;
 $173 = sp + 384|0;
 $175 = sp + 376|0;
 $176 = sp + 372|0;
 $179 = sp + 360|0;
 $180 = sp + 356|0;
 $181 = sp + 352|0;
 $182 = sp + 348|0;
 $183 = sp + 24|0;
 $184 = sp + 16|0;
 $186 = sp + 8|0;
 $194 = sp + 312|0;
 $196 = sp + 304|0;
 $198 = sp + 296|0;
 $200 = sp;
 $204 = sp + 276|0;
 $206 = sp + 268|0;
 $208 = sp + 260|0;
 $211 = sp + 248|0;
 $212 = sp + 244|0;
 $219 = sp + 216|0;
 $220 = sp + 212|0;
 $221 = sp + 208|0;
 $222 = sp + 204|0;
 $223 = sp + 192|0;
 $224 = sp + 180|0;
 $225 = sp + 168|0;
 $226 = sp + 156|0;
 $227 = sp + 144|0;
 $215 = $0;
 $216 = $1;
 $217 = $2;
 $218 = $3;
 HEAP32[$219>>2] = $4;
 $214 = $220;
 $229 = $214;
 $213 = $229;
 HEAP32[$221>>2] = 0;
 $230 = $215;
 $209 = $223;
 $210 = $230;
 $231 = $209;
 $232 = $210;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSD_($231,$232);
 $233 = $210;
 $207 = $233;
 $234 = $207;
 $205 = $234;
 $235 = $205;
 $203 = $235;
 $236 = $203;
 $237 = HEAP32[$236>>2]|0;
 $201 = $204;
 $202 = $237;
 $238 = $201;
 $239 = $202;
 HEAP32[$238>>2] = $239;
 $240 = HEAP32[$204>>2]|0;
 HEAP32[$208>>2] = $240;
 ;HEAP8[$200>>0]=HEAP8[$208>>0]|0;HEAP8[$200+1>>0]=HEAP8[$208+1>>0]|0;HEAP8[$200+2>>0]=HEAP8[$208+2>>0]|0;HEAP8[$200+3>>0]=HEAP8[$208+3>>0]|0;
 $199 = $206;
 $241 = $199;
 ;HEAP32[$241>>2]=HEAP32[$200>>2]|0;
 $242 = HEAP32[$206>>2]|0;
 HEAP32[$211>>2] = $242;
 $243 = $210;
 $197 = $243;
 $244 = $197;
 $195 = $244;
 $245 = $195;
 $193 = $245;
 $246 = $193;
 $247 = ((($246)) + 4|0);
 $192 = $247;
 $248 = $192;
 $191 = $248;
 $249 = $191;
 $190 = $249;
 $250 = $190;
 $189 = $250;
 $251 = $189;
 $187 = $194;
 $188 = $251;
 $252 = $187;
 $253 = $188;
 HEAP32[$252>>2] = $253;
 $254 = HEAP32[$194>>2]|0;
 HEAP32[$198>>2] = $254;
 ;HEAP8[$186>>0]=HEAP8[$198>>0]|0;HEAP8[$186+1>>0]=HEAP8[$198+1>>0]|0;HEAP8[$186+2>>0]=HEAP8[$198+2>>0]|0;HEAP8[$186+3>>0]=HEAP8[$198+3>>0]|0;
 $185 = $196;
 $255 = $185;
 ;HEAP32[$255>>2]=HEAP32[$186>>2]|0;
 $256 = HEAP32[$196>>2]|0;
 HEAP32[$212>>2] = $256;
 ;HEAP8[$183>>0]=HEAP8[$212>>0]|0;HEAP8[$183+1>>0]=HEAP8[$212+1>>0]|0;HEAP8[$183+2>>0]=HEAP8[$212+2>>0]|0;HEAP8[$183+3>>0]=HEAP8[$212+3>>0]|0;
 ;HEAP8[$184>>0]=HEAP8[$211>>0]|0;HEAP8[$184+1>>0]=HEAP8[$211+1>>0]|0;HEAP8[$184+2>>0]=HEAP8[$211+2>>0]|0;HEAP8[$184+3>>0]=HEAP8[$211+3>>0]|0;
 $178 = $231;
 $257 = $178;
 $177 = $257;
 $258 = $177;
 $174 = $258;
 $259 = $174;
 $172 = $259;
 $260 = $172;
 $170 = $260;
 $261 = $170;
 $262 = ((($261)) + 4|0);
 $169 = $262;
 $263 = $169;
 $168 = $263;
 $264 = $168;
 $167 = $264;
 $265 = $167;
 $166 = $265;
 $266 = $166;
 $164 = $171;
 $165 = $266;
 $267 = $164;
 $268 = $165;
 HEAP32[$267>>2] = $268;
 $269 = HEAP32[$171>>2]|0;
 HEAP32[$175>>2] = $269;
 ;HEAP8[$163>>0]=HEAP8[$175>>0]|0;HEAP8[$163+1>>0]=HEAP8[$175+1>>0]|0;HEAP8[$163+2>>0]=HEAP8[$175+2>>0]|0;HEAP8[$163+3>>0]=HEAP8[$175+3>>0]|0;
 $162 = $173;
 $270 = $162;
 ;HEAP32[$270>>2]=HEAP32[$163>>2]|0;
 $271 = HEAP32[$173>>2]|0;
 HEAP32[$176>>2] = $271;
 $272 = HEAP32[$176>>2]|0;
 HEAP32[$179>>2] = $272;
 while(1) {
  $139 = $184;
  $140 = $183;
  $273 = $139;
  $274 = $140;
  $137 = $273;
  $138 = $274;
  $275 = $137;
  $276 = $138;
  $135 = $275;
  $136 = $276;
  $277 = $135;
  $278 = HEAP32[$277>>2]|0;
  $279 = $136;
  $280 = HEAP32[$279>>2]|0;
  $281 = ($278|0)==($280|0);
  $282 = $281 ^ 1;
  if (!($282)) {
   break;
  }
  ;HEAP32[$181>>2]=HEAP32[$179>>2]|0;
  ;HEAP8[$129>>0]=HEAP8[$181>>0]|0;HEAP8[$129+1>>0]=HEAP8[$181+1>>0]|0;HEAP8[$129+2>>0]=HEAP8[$181+2>>0]|0;HEAP8[$129+3>>0]=HEAP8[$181+3>>0]|0;
  $128 = $180;
  $283 = $128;
  ;HEAP32[$283>>2]=HEAP32[$129>>2]|0;
  $134 = $184;
  $284 = $134;
  $133 = $284;
  $285 = $133;
  $132 = $285;
  $286 = $132;
  $287 = HEAP32[$286>>2]|0;
  $288 = ((($287)) + 16|0);
  $131 = $288;
  $289 = $131;
  $130 = $289;
  $290 = $130;
  ;HEAP8[$154>>0]=HEAP8[$180>>0]|0;HEAP8[$154+1>>0]=HEAP8[$180+1>>0]|0;HEAP8[$154+2>>0]=HEAP8[$180+2>>0]|0;HEAP8[$154+3>>0]=HEAP8[$180+3>>0]|0;
  $150 = $257;
  $151 = $290;
  $291 = $150;
  ;HEAP32[$153>>2]=HEAP32[$154>>2]|0;
  $292 = $151;
  ;HEAP8[$148>>0]=HEAP8[$153>>0]|0;HEAP8[$148+1>>0]=HEAP8[$153+1>>0]|0;HEAP8[$148+2>>0]=HEAP8[$153+2>>0]|0;HEAP8[$148+3>>0]=HEAP8[$153+3>>0]|0;
  $145 = $291;
  $146 = $292;
  $293 = $145;
  ;HEAP32[$147>>2]=HEAP32[$148>>2]|0;
  $294 = $146;
  $143 = $294;
  $295 = $143;
  $296 = $146;
  ;HEAP32[$$byval_copy>>2]=HEAP32[$147>>2]|0;
  $297 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE30__emplace_hint_unique_key_argsIiJRKNS_4pairIKiS7_EEEEENS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEENS_21__tree_const_iteratorIS8_SO_lEERKT_DpOT0_($293,$$byval_copy,$295,$296)|0);
  HEAP32[$144>>2] = $297;
  $298 = HEAP32[$144>>2]|0;
  HEAP32[$152>>2] = $298;
  ;HEAP8[$142>>0]=HEAP8[$152>>0]|0;HEAP8[$142+1>>0]=HEAP8[$152+1>>0]|0;HEAP8[$142+2>>0]=HEAP8[$152+2>>0]|0;HEAP8[$142+3>>0]=HEAP8[$152+3>>0]|0;
  $141 = $149;
  $299 = $141;
  ;HEAP32[$299>>2]=HEAP32[$142>>2]|0;
  $300 = HEAP32[$149>>2]|0;
  HEAP32[$182>>2] = $300;
  $161 = $184;
  $301 = $161;
  $160 = $301;
  $302 = $160;
  $303 = HEAP32[$302>>2]|0;
  $159 = $303;
  $304 = $159;
  $305 = ((($304)) + 4|0);
  $306 = HEAP32[$305>>2]|0;
  $307 = ($306|0)!=(0|0);
  if ($307) {
   $308 = $159;
   $309 = ((($308)) + 4|0);
   $310 = HEAP32[$309>>2]|0;
   $157 = $310;
   while(1) {
    $311 = $157;
    $312 = HEAP32[$311>>2]|0;
    $313 = ($312|0)!=(0|0);
    $314 = $157;
    if (!($313)) {
     break;
    }
    $315 = HEAP32[$314>>2]|0;
    $157 = $315;
   }
   $158 = $314;
  } else {
   while(1) {
    $316 = $159;
    $156 = $316;
    $317 = $156;
    $318 = $156;
    $319 = ((($318)) + 8|0);
    $320 = HEAP32[$319>>2]|0;
    $321 = HEAP32[$320>>2]|0;
    $322 = ($317|0)==($321|0);
    $323 = $322 ^ 1;
    $324 = $159;
    if (!($323)) {
     break;
    }
    $155 = $324;
    $325 = $155;
    $326 = ((($325)) + 8|0);
    $327 = HEAP32[$326>>2]|0;
    $159 = $327;
   }
   $328 = ((($324)) + 8|0);
   $329 = HEAP32[$328>>2]|0;
   $158 = $329;
  }
  $330 = $158;
  HEAP32[$302>>2] = $330;
 }
 $331 = $217;
 $332 = (__Z5countNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEi($223,$331)|0);
 __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($223);
 HEAP32[$222>>2] = $332;
 $333 = $216;
 $334 = $215;
 $124 = $227;
 $125 = $334;
 $335 = $124;
 $336 = $125;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSD_($335,$336);
 $337 = $125;
 $122 = $337;
 $338 = $122;
 $120 = $338;
 $339 = $120;
 $118 = $339;
 $340 = $118;
 $341 = HEAP32[$340>>2]|0;
 $116 = $119;
 $117 = $341;
 $342 = $116;
 $343 = $117;
 HEAP32[$342>>2] = $343;
 $344 = HEAP32[$119>>2]|0;
 HEAP32[$123>>2] = $344;
 ;HEAP8[$115>>0]=HEAP8[$123>>0]|0;HEAP8[$115+1>>0]=HEAP8[$123+1>>0]|0;HEAP8[$115+2>>0]=HEAP8[$123+2>>0]|0;HEAP8[$115+3>>0]=HEAP8[$123+3>>0]|0;
 $114 = $121;
 $345 = $114;
 ;HEAP32[$345>>2]=HEAP32[$115>>2]|0;
 $346 = HEAP32[$121>>2]|0;
 HEAP32[$126>>2] = $346;
 $347 = $125;
 $112 = $347;
 $348 = $112;
 $110 = $348;
 $349 = $110;
 $108 = $349;
 $350 = $108;
 $351 = ((($350)) + 4|0);
 $107 = $351;
 $352 = $107;
 $106 = $352;
 $353 = $106;
 $105 = $353;
 $354 = $105;
 $104 = $354;
 $355 = $104;
 $102 = $109;
 $103 = $355;
 $356 = $102;
 $357 = $103;
 HEAP32[$356>>2] = $357;
 $358 = HEAP32[$109>>2]|0;
 HEAP32[$113>>2] = $358;
 ;HEAP8[$101>>0]=HEAP8[$113>>0]|0;HEAP8[$101+1>>0]=HEAP8[$113+1>>0]|0;HEAP8[$101+2>>0]=HEAP8[$113+2>>0]|0;HEAP8[$101+3>>0]=HEAP8[$113+3>>0]|0;
 $100 = $111;
 $359 = $100;
 ;HEAP32[$359>>2]=HEAP32[$101>>2]|0;
 $360 = HEAP32[$111>>2]|0;
 HEAP32[$127>>2] = $360;
 ;HEAP8[$98>>0]=HEAP8[$127>>0]|0;HEAP8[$98+1>>0]=HEAP8[$127+1>>0]|0;HEAP8[$98+2>>0]=HEAP8[$127+2>>0]|0;HEAP8[$98+3>>0]=HEAP8[$127+3>>0]|0;
 ;HEAP8[$99>>0]=HEAP8[$126>>0]|0;HEAP8[$99+1>>0]=HEAP8[$126+1>>0]|0;HEAP8[$99+2>>0]=HEAP8[$126+2>>0]|0;HEAP8[$99+3>>0]=HEAP8[$126+3>>0]|0;
 $93 = $335;
 $361 = $93;
 $92 = $361;
 $362 = $92;
 $89 = $362;
 $363 = $89;
 $87 = $363;
 $364 = $87;
 $85 = $364;
 $365 = $85;
 $366 = ((($365)) + 4|0);
 $84 = $366;
 $367 = $84;
 $83 = $367;
 $368 = $83;
 $82 = $368;
 $369 = $82;
 $81 = $369;
 $370 = $81;
 $79 = $86;
 $80 = $370;
 $371 = $79;
 $372 = $80;
 HEAP32[$371>>2] = $372;
 $373 = HEAP32[$86>>2]|0;
 HEAP32[$90>>2] = $373;
 ;HEAP8[$78>>0]=HEAP8[$90>>0]|0;HEAP8[$78+1>>0]=HEAP8[$90+1>>0]|0;HEAP8[$78+2>>0]=HEAP8[$90+2>>0]|0;HEAP8[$78+3>>0]=HEAP8[$90+3>>0]|0;
 $77 = $88;
 $374 = $77;
 ;HEAP32[$374>>2]=HEAP32[$78>>2]|0;
 $375 = HEAP32[$88>>2]|0;
 HEAP32[$91>>2] = $375;
 $376 = HEAP32[$91>>2]|0;
 HEAP32[$94>>2] = $376;
 while(1) {
  $54 = $99;
  $55 = $98;
  $377 = $54;
  $378 = $55;
  $52 = $377;
  $53 = $378;
  $379 = $52;
  $380 = $53;
  $50 = $379;
  $51 = $380;
  $381 = $50;
  $382 = HEAP32[$381>>2]|0;
  $383 = $51;
  $384 = HEAP32[$383>>2]|0;
  $385 = ($382|0)==($384|0);
  $386 = $385 ^ 1;
  if (!($386)) {
   break;
  }
  ;HEAP32[$96>>2]=HEAP32[$94>>2]|0;
  ;HEAP8[$44>>0]=HEAP8[$96>>0]|0;HEAP8[$44+1>>0]=HEAP8[$96+1>>0]|0;HEAP8[$44+2>>0]=HEAP8[$96+2>>0]|0;HEAP8[$44+3>>0]=HEAP8[$96+3>>0]|0;
  $43 = $95;
  $387 = $43;
  ;HEAP32[$387>>2]=HEAP32[$44>>2]|0;
  $49 = $99;
  $388 = $49;
  $48 = $388;
  $389 = $48;
  $47 = $389;
  $390 = $47;
  $391 = HEAP32[$390>>2]|0;
  $392 = ((($391)) + 16|0);
  $46 = $392;
  $393 = $46;
  $45 = $393;
  $394 = $45;
  ;HEAP8[$69>>0]=HEAP8[$95>>0]|0;HEAP8[$69+1>>0]=HEAP8[$95+1>>0]|0;HEAP8[$69+2>>0]=HEAP8[$95+2>>0]|0;HEAP8[$69+3>>0]=HEAP8[$95+3>>0]|0;
  $65 = $361;
  $66 = $394;
  $395 = $65;
  ;HEAP32[$68>>2]=HEAP32[$69>>2]|0;
  $396 = $66;
  ;HEAP8[$63>>0]=HEAP8[$68>>0]|0;HEAP8[$63+1>>0]=HEAP8[$68+1>>0]|0;HEAP8[$63+2>>0]=HEAP8[$68+2>>0]|0;HEAP8[$63+3>>0]=HEAP8[$68+3>>0]|0;
  $60 = $395;
  $61 = $396;
  $397 = $60;
  ;HEAP32[$62>>2]=HEAP32[$63>>2]|0;
  $398 = $61;
  $58 = $398;
  $399 = $58;
  $400 = $61;
  ;HEAP32[$$byval_copy1>>2]=HEAP32[$62>>2]|0;
  $401 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE30__emplace_hint_unique_key_argsIiJRKNS_4pairIKiS7_EEEEENS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEENS_21__tree_const_iteratorIS8_SO_lEERKT_DpOT0_($397,$$byval_copy1,$399,$400)|0);
  HEAP32[$59>>2] = $401;
  $402 = HEAP32[$59>>2]|0;
  HEAP32[$67>>2] = $402;
  ;HEAP8[$57>>0]=HEAP8[$67>>0]|0;HEAP8[$57+1>>0]=HEAP8[$67+1>>0]|0;HEAP8[$57+2>>0]=HEAP8[$67+2>>0]|0;HEAP8[$57+3>>0]=HEAP8[$67+3>>0]|0;
  $56 = $64;
  $403 = $56;
  ;HEAP32[$403>>2]=HEAP32[$57>>2]|0;
  $404 = HEAP32[$64>>2]|0;
  HEAP32[$97>>2] = $404;
  $76 = $99;
  $405 = $76;
  $75 = $405;
  $406 = $75;
  $407 = HEAP32[$406>>2]|0;
  $74 = $407;
  $408 = $74;
  $409 = ((($408)) + 4|0);
  $410 = HEAP32[$409>>2]|0;
  $411 = ($410|0)!=(0|0);
  if ($411) {
   $412 = $74;
   $413 = ((($412)) + 4|0);
   $414 = HEAP32[$413>>2]|0;
   $72 = $414;
   while(1) {
    $415 = $72;
    $416 = HEAP32[$415>>2]|0;
    $417 = ($416|0)!=(0|0);
    $418 = $72;
    if (!($417)) {
     break;
    }
    $419 = HEAP32[$418>>2]|0;
    $72 = $419;
   }
   $73 = $418;
  } else {
   while(1) {
    $420 = $74;
    $71 = $420;
    $421 = $71;
    $422 = $71;
    $423 = ((($422)) + 8|0);
    $424 = HEAP32[$423>>2]|0;
    $425 = HEAP32[$424>>2]|0;
    $426 = ($421|0)==($425|0);
    $427 = $426 ^ 1;
    $428 = $74;
    if (!($427)) {
     break;
    }
    $70 = $428;
    $429 = $70;
    $430 = ((($429)) + 8|0);
    $431 = HEAP32[$430>>2]|0;
    $74 = $431;
   }
   $432 = ((($428)) + 8|0);
   $433 = HEAP32[$432>>2]|0;
   $73 = $433;
  }
  $434 = $73;
  HEAP32[$406>>2] = $434;
 }
 $435 = $217;
 __Z9handToStrNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEi($226,$227,$435);
 $41 = 3869;
 $42 = $226;
 $436 = $42;
 $437 = $41;
 $438 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKc($436,0,$437)|0);
 $40 = $438;
 $439 = $40;
 $38 = $225;
 $39 = $439;
 $440 = $38;
 $441 = $39;
 $37 = $441;
 $442 = $37;
 ;HEAP32[$440>>2]=HEAP32[$442>>2]|0;HEAP32[$440+4>>2]=HEAP32[$442+4>>2]|0;HEAP32[$440+8>>2]=HEAP32[$442+8>>2]|0;
 $443 = $39;
 $34 = $443;
 $444 = $34;
 $33 = $444;
 $445 = $33;
 $32 = $445;
 $446 = $32;
 $35 = $446;
 $36 = 0;
 while(1) {
  $447 = $36;
  $448 = ($447>>>0)<(3);
  if (!($448)) {
   break;
  }
  $449 = $35;
  $450 = $36;
  $451 = (($449) + ($450<<2)|0);
  HEAP32[$451>>2] = 0;
  $452 = $36;
  $453 = (($452) + 1)|0;
  $36 = $453;
 }
 $30 = $225;
 $31 = 3872;
 $454 = $30;
 $455 = $31;
 $456 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($454,$455)|0);
 $29 = $456;
 $457 = $29;
 $27 = $224;
 $28 = $457;
 $458 = $27;
 $459 = $28;
 $26 = $459;
 $460 = $26;
 ;HEAP32[$458>>2]=HEAP32[$460>>2]|0;HEAP32[$458+4>>2]=HEAP32[$460+4>>2]|0;HEAP32[$458+8>>2]=HEAP32[$460+8>>2]|0;
 $461 = $28;
 $23 = $461;
 $462 = $23;
 $22 = $462;
 $463 = $22;
 $21 = $463;
 $464 = $21;
 $24 = $464;
 $25 = 0;
 while(1) {
  $465 = $25;
  $466 = ($465>>>0)<(3);
  if (!($466)) {
   break;
  }
  $467 = $24;
  $468 = $25;
  $469 = (($467) + ($468<<2)|0);
  HEAP32[$469>>2] = 0;
  $470 = $25;
  $471 = (($470) + 1)|0;
  $25 = $471;
 }
 __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE9push_backEOS6_($333,$224);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($224);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($225);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($226);
 __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($227);
 $228 = 0;
 while(1) {
  $472 = $228;
  $473 = ($472|0)<(5);
  if (!($473)) {
   break;
  }
  $474 = $228;
  $19 = 7664;
  $20 = $474;
  $475 = $19;
  $18 = $475;
  $476 = $18;
  $17 = $476;
  $477 = $17;
  $16 = $477;
  $478 = $16;
  $15 = $478;
  $479 = $15;
  $14 = $479;
  $480 = $14;
  $481 = ((($480)) + 11|0);
  $482 = HEAP8[$481>>0]|0;
  $483 = $482&255;
  $484 = $483 & 128;
  $485 = ($484|0)!=(0);
  if ($485) {
   $8 = $477;
   $486 = $8;
   $7 = $486;
   $487 = $7;
   $6 = $487;
   $488 = $6;
   $489 = HEAP32[$488>>2]|0;
   $495 = $489;
  } else {
   $13 = $477;
   $490 = $13;
   $12 = $490;
   $491 = $12;
   $11 = $491;
   $492 = $11;
   $10 = $492;
   $493 = $10;
   $9 = $493;
   $494 = $9;
   $495 = $494;
  }
  $5 = $495;
  $496 = $5;
  $497 = $20;
  $498 = (($496) + ($497)|0);
  $499 = HEAP8[$498>>0]|0;
  $500 = $218;
  $501 = $215;
  $502 = $217;
  $503 = $216;
  __Z17tryExtractOneHandciiRiiS_RNSt3__23mapIiNS0_8multisetIcNS0_4lessIcEENS0_9allocatorIcEEEENS3_IiEENS5_INS0_4pairIKiS7_EEEEEEiRNS0_4listINS0_12basic_stringIcNS0_11char_traitsIcEES6_EENS5_ISJ_EEEES_($499,5,1,$221,$500,$219,$501,$502,$503,$222);
  $504 = $228;
  $505 = (($504) + 1)|0;
  $228 = $505;
 }
 $506 = $218;
 $507 = $215;
 $508 = $217;
 $509 = $216;
 __Z17tryExtractOneHandciiRiiS_RNSt3__23mapIiNS0_8multisetIcNS0_4lessIcEENS0_9allocatorIcEEEENS3_IiEENS5_INS0_4pairIKiS7_EEEEEEiRNS0_4listINS0_12basic_stringIcNS0_11char_traitsIcEES6_EENS5_ISJ_EEEES_(65,3,2,$221,$506,$219,$507,$508,$509,$222);
 $510 = $218;
 $511 = $215;
 $512 = $217;
 $513 = $216;
 __Z17tryExtractOneHandciiRiiS_RNSt3__23mapIiNS0_8multisetIcNS0_4lessIcEENS0_9allocatorIcEEEENS3_IiEENS5_INS0_4pairIKiS7_EEEEEEiRNS0_4listINS0_12basic_stringIcNS0_11char_traitsIcEES6_EENS5_ISJ_EEEES_(65,2,3,$221,$510,$219,$511,$512,$513,$222);
 $514 = HEAP32[$222>>2]|0;
 STACKTOP = sp;return ($514|0);
}
function __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEED2Ev($2);
 STACKTOP = sp;return;
}
function __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6spliceENS_21__list_const_iteratorIS6_PvEERS8_SB_SB_($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $12 = 0, $13 = 0, $14 = 0;
 var $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
 var $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0;
 var $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0;
 var $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0;
 var $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 176|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(176|0);
 $11 = sp + 32|0;
 $12 = sp + 24|0;
 $13 = sp + 16|0;
 $14 = sp + 132|0;
 $15 = sp + 128|0;
 $16 = sp + 160|0;
 $17 = sp + 8|0;
 $18 = sp;
 $38 = sp + 48|0;
 $39 = sp + 44|0;
 $35 = $0;
 $36 = $2;
 $42 = $35;
 $33 = $3;
 $34 = $4;
 $43 = $33;
 $44 = $34;
 $31 = $43;
 $32 = $44;
 $45 = $31;
 $46 = HEAP32[$45>>2]|0;
 $47 = $32;
 $48 = HEAP32[$47>>2]|0;
 $49 = ($46|0)==($48|0);
 $50 = $49 ^ 1;
 if (!($50)) {
  STACKTOP = sp;return;
 }
 $51 = $36;
 $52 = ($42|0)!=($51|0);
 if ($52) {
  ;HEAP32[$38>>2]=HEAP32[$3>>2]|0;
  ;HEAP32[$39>>2]=HEAP32[$4>>2]|0;
  ;HEAP8[$17>>0]=HEAP8[$39>>0]|0;HEAP8[$17+1>>0]=HEAP8[$39+1>>0]|0;HEAP8[$17+2>>0]=HEAP8[$39+2>>0]|0;HEAP8[$17+3>>0]=HEAP8[$39+3>>0]|0;
  ;HEAP8[$18>>0]=HEAP8[$38>>0]|0;HEAP8[$18+1>>0]=HEAP8[$38+1>>0]|0;HEAP8[$18+2>>0]=HEAP8[$38+2>>0]|0;HEAP8[$18+3>>0]=HEAP8[$38+3>>0]|0;
  ;HEAP32[$14>>2]=HEAP32[$18>>2]|0;
  ;HEAP32[$15>>2]=HEAP32[$17>>2]|0;
  ;HEAP8[$11>>0]=HEAP8[$16>>0]|0;
  ;HEAP8[$12>>0]=HEAP8[$15>>0]|0;HEAP8[$12+1>>0]=HEAP8[$15+1>>0]|0;HEAP8[$12+2>>0]=HEAP8[$15+2>>0]|0;HEAP8[$12+3>>0]=HEAP8[$15+3>>0]|0;
  ;HEAP8[$13>>0]=HEAP8[$14>>0]|0;HEAP8[$13+1>>0]=HEAP8[$14+1>>0]|0;HEAP8[$13+2>>0]=HEAP8[$14+2>>0]|0;HEAP8[$13+3>>0]=HEAP8[$14+3>>0]|0;
  $10 = 0;
  while(1) {
   $8 = $13;
   $9 = $12;
   $53 = $8;
   $54 = $9;
   $6 = $53;
   $7 = $54;
   $55 = $6;
   $56 = HEAP32[$55>>2]|0;
   $57 = $7;
   $58 = HEAP32[$57>>2]|0;
   $59 = ($56|0)==($58|0);
   $60 = $59 ^ 1;
   $61 = $10;
   if (!($60)) {
    break;
   }
   $62 = (($61) + 1)|0;
   $10 = $62;
   $5 = $13;
   $63 = $5;
   $64 = HEAP32[$63>>2]|0;
   $65 = ((($64)) + 4|0);
   $66 = HEAP32[$65>>2]|0;
   HEAP32[$63>>2] = $66;
  }
  $37 = $61;
  $67 = $37;
  $68 = $36;
  $21 = $68;
  $69 = $21;
  $70 = ((($69)) + 8|0);
  $20 = $70;
  $71 = $20;
  $19 = $71;
  $72 = $19;
  $73 = HEAP32[$72>>2]|0;
  $74 = (($73) - ($67))|0;
  HEAP32[$72>>2] = $74;
  $75 = $37;
  $24 = $42;
  $76 = $24;
  $77 = ((($76)) + 8|0);
  $23 = $77;
  $78 = $23;
  $22 = $78;
  $79 = $22;
  $80 = HEAP32[$79>>2]|0;
  $81 = (($80) + ($75))|0;
  HEAP32[$79>>2] = $81;
 }
 $82 = HEAP32[$3>>2]|0;
 $40 = $82;
 $25 = $4;
 $83 = $25;
 $84 = HEAP32[$83>>2]|0;
 $85 = HEAP32[$84>>2]|0;
 HEAP32[$83>>2] = $85;
 $86 = HEAP32[$4>>2]|0;
 $41 = $86;
 $87 = $40;
 $88 = $41;
 $26 = $87;
 $27 = $88;
 $89 = $27;
 $90 = ((($89)) + 4|0);
 $91 = HEAP32[$90>>2]|0;
 $92 = $26;
 $93 = HEAP32[$92>>2]|0;
 $94 = ((($93)) + 4|0);
 HEAP32[$94>>2] = $91;
 $95 = $26;
 $96 = HEAP32[$95>>2]|0;
 $97 = $27;
 $98 = ((($97)) + 4|0);
 $99 = HEAP32[$98>>2]|0;
 HEAP32[$99>>2] = $96;
 $100 = HEAP32[$1>>2]|0;
 $101 = $40;
 $102 = $41;
 $28 = $100;
 $29 = $101;
 $30 = $102;
 $103 = $29;
 $104 = $28;
 $105 = HEAP32[$104>>2]|0;
 $106 = ((($105)) + 4|0);
 HEAP32[$106>>2] = $103;
 $107 = $28;
 $108 = HEAP32[$107>>2]|0;
 $109 = $29;
 HEAP32[$109>>2] = $108;
 $110 = $30;
 $111 = $28;
 HEAP32[$111>>2] = $110;
 $112 = $28;
 $113 = $30;
 $114 = ((($113)) + 4|0);
 HEAP32[$114>>2] = $112;
 STACKTOP = sp;return;
}
function __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 __ZNSt3__210__list_impINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($2);
 STACKTOP = sp;return;
}
function __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE9push_backEOS6_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0;
 var $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0;
 var $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0;
 var $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0;
 var $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 480|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(480|0);
 $68 = sp;
 $73 = sp + 472|0;
 $92 = sp + 116|0;
 $110 = sp + 40|0;
 $117 = sp + 4|0;
 $114 = $0;
 $115 = $1;
 $118 = $114;
 $113 = $118;
 $119 = $113;
 $120 = ((($119)) + 8|0);
 $112 = $120;
 $121 = $112;
 $111 = $121;
 $122 = $111;
 $116 = $122;
 $123 = $116;
 $107 = $118;
 $108 = $123;
 $124 = $108;
 $105 = $124;
 $106 = 1;
 $125 = $105;
 $126 = $106;
 $102 = $125;
 $103 = $126;
 $104 = 0;
 $127 = $102;
 $128 = $103;
 $101 = $127;
 $129 = ($128>>>0)>(214748364);
 if ($129) {
  $99 = 3928;
  $130 = (___cxa_allocate_exception(8)|0);
  $131 = $99;
  $97 = $130;
  $98 = $131;
  $132 = $97;
  $133 = $98;
  __ZNSt11logic_errorC2EPKc($132,$133);
  HEAP32[$132>>2] = (3644);
  ___cxa_throw(($130|0),(2792|0),(18|0));
  // unreachable;
 }
 $134 = $103;
 $135 = ($134*20)|0;
 $100 = $135;
 $136 = $100;
 $137 = (__Znwm($136)|0);
 $109 = $137;
 $138 = $109;
 HEAP32[$138>>2] = 0;
 $139 = $109;
 $140 = $108;
 $94 = $110;
 $95 = $140;
 $96 = 1;
 $141 = $94;
 $142 = $95;
 HEAP32[$141>>2] = $142;
 $143 = ((($141)) + 4|0);
 $144 = $96;
 HEAP32[$143>>2] = $144;
 $91 = $117;
 HEAP32[$92>>2] = $139;
 $93 = $110;
 $145 = $91;
 $146 = $93;
 $90 = $146;
 $147 = $90;
 $87 = $145;
 $88 = $92;
 $89 = $147;
 $148 = $87;
 $149 = $88;
 $86 = $149;
 $150 = $86;
 $80 = $148;
 $81 = $150;
 $151 = $80;
 $152 = $81;
 $79 = $152;
 $153 = $79;
 $154 = HEAP32[$153>>2]|0;
 HEAP32[$151>>2] = $154;
 $155 = ((($148)) + 4|0);
 $156 = $89;
 $82 = $156;
 $157 = $82;
 $84 = $155;
 $85 = $157;
 $158 = $84;
 $159 = $85;
 $83 = $159;
 $160 = $83;
 ;HEAP32[$158>>2]=HEAP32[$160>>2]|0;HEAP32[$158+4>>2]=HEAP32[$160+4>>2]|0;
 $161 = $116;
 $78 = $117;
 $162 = $78;
 $77 = $162;
 $163 = $77;
 $76 = $163;
 $164 = $76;
 $165 = HEAP32[$164>>2]|0;
 $166 = ((($165)) + 8|0);
 $75 = $166;
 $167 = $75;
 $168 = $115;
 $74 = $168;
 $169 = $74;
 $70 = $161;
 $71 = $167;
 $72 = $169;
 $170 = $70;
 $171 = $71;
 $172 = $72;
 $69 = $172;
 $173 = $69;
 ;HEAP8[$68>>0]=HEAP8[$73>>0]|0;
 $65 = $170;
 $66 = $171;
 $67 = $173;
 $174 = $65;
 $175 = $66;
 $176 = $67;
 $64 = $176;
 $177 = $64;
 $61 = $174;
 $62 = $175;
 $63 = $177;
 $178 = $62;
 $179 = $63;
 $60 = $179;
 $180 = $60;
 $58 = $178;
 $59 = $180;
 $181 = $58;
 $182 = $59;
 $57 = $182;
 $183 = $57;
 ;HEAP32[$181>>2]=HEAP32[$183>>2]|0;HEAP32[$181+4>>2]=HEAP32[$183+4>>2]|0;HEAP32[$181+8>>2]=HEAP32[$183+8>>2]|0;
 $184 = $59;
 $54 = $184;
 $185 = $54;
 $53 = $185;
 $186 = $53;
 $52 = $186;
 $187 = $52;
 $55 = $187;
 $56 = 0;
 while(1) {
  $188 = $56;
  $189 = ($188>>>0)<(3);
  if (!($189)) {
   break;
  }
  $190 = $55;
  $191 = $56;
  $192 = (($190) + ($191<<2)|0);
  HEAP32[$192>>2] = 0;
  $193 = $56;
  $194 = (($193) + 1)|0;
  $56 = $194;
 }
 $51 = $117;
 $195 = $51;
 $50 = $195;
 $196 = $50;
 $49 = $196;
 $197 = $49;
 $198 = HEAP32[$197>>2]|0;
 $29 = $198;
 $199 = $29;
 $28 = $199;
 $200 = $28;
 $27 = $200;
 $201 = $27;
 $26 = $201;
 $202 = $26;
 $4 = $117;
 $203 = $4;
 $3 = $203;
 $204 = $3;
 $2 = $204;
 $205 = $2;
 $206 = HEAP32[$205>>2]|0;
 $8 = $206;
 $207 = $8;
 $7 = $207;
 $208 = $7;
 $6 = $208;
 $209 = $6;
 $5 = $209;
 $210 = $5;
 $14 = $118;
 $15 = $202;
 $16 = $210;
 $211 = $14;
 $13 = $211;
 $212 = $13;
 $12 = $212;
 $213 = $12;
 $11 = $213;
 $214 = $11;
 $10 = $214;
 $215 = $10;
 $9 = $215;
 $216 = $9;
 $217 = $16;
 $218 = ((($217)) + 4|0);
 HEAP32[$218>>2] = $216;
 $219 = HEAP32[$211>>2]|0;
 $220 = $15;
 HEAP32[$220>>2] = $219;
 $221 = $15;
 $222 = $15;
 $223 = HEAP32[$222>>2]|0;
 $224 = ((($223)) + 4|0);
 HEAP32[$224>>2] = $221;
 $225 = $16;
 HEAP32[$211>>2] = $225;
 $19 = $118;
 $226 = $19;
 $227 = ((($226)) + 8|0);
 $18 = $227;
 $228 = $18;
 $17 = $228;
 $229 = $17;
 $230 = HEAP32[$229>>2]|0;
 $231 = (($230) + 1)|0;
 HEAP32[$229>>2] = $231;
 $24 = $117;
 $232 = $24;
 $23 = $232;
 $233 = $23;
 $22 = $233;
 $234 = $22;
 $235 = HEAP32[$234>>2]|0;
 $25 = $235;
 $21 = $232;
 $236 = $21;
 $20 = $236;
 $237 = $20;
 HEAP32[$237>>2] = 0;
 $48 = $117;
 $238 = $48;
 $45 = $238;
 $46 = 0;
 $239 = $45;
 $44 = $239;
 $240 = $44;
 $43 = $240;
 $241 = $43;
 $242 = HEAP32[$241>>2]|0;
 $47 = $242;
 $243 = $46;
 $33 = $239;
 $244 = $33;
 $32 = $244;
 $245 = $32;
 HEAP32[$245>>2] = $243;
 $246 = $47;
 $247 = ($246|0)!=(0|0);
 if (!($247)) {
  STACKTOP = sp;return;
 }
 $31 = $239;
 $248 = $31;
 $249 = ((($248)) + 4|0);
 $30 = $249;
 $250 = $30;
 $251 = $47;
 $41 = $250;
 $42 = $251;
 $252 = $41;
 $253 = HEAP32[$252>>2]|0;
 $254 = $42;
 $255 = ((($252)) + 4|0);
 $256 = HEAP32[$255>>2]|0;
 $38 = $253;
 $39 = $254;
 $40 = $256;
 $257 = $38;
 $258 = $39;
 $259 = $40;
 $35 = $257;
 $36 = $258;
 $37 = $259;
 $260 = $36;
 $34 = $260;
 $261 = $34;
 __ZdlPv($261);
 STACKTOP = sp;return;
}
function __Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEc($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$byval_copy = 0, $$byval_copy1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0;
 var $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0;
 var $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0;
 var $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0;
 var $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0;
 var $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0;
 var $225 = 0, $226 = 0, $227 = 0, $228 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0;
 var $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0;
 var $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0;
 var $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0;
 var $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 384|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(384|0);
 $$byval_copy1 = sp + 364|0;
 $$byval_copy = sp + 360|0;
 $5 = sp + 348|0;
 $7 = sp + 340|0;
 $16 = sp + 304|0;
 $18 = sp + 296|0;
 $77 = sp + 60|0;
 $80 = sp;
 $82 = sp + 372|0;
 $83 = sp + 371|0;
 $85 = sp + 36|0;
 $86 = sp + 24|0;
 $92 = sp + 8|0;
 $93 = sp + 4|0;
 $84 = $2;
 $81 = $85;
 $94 = $81;
 ;HEAP8[$80>>0]=HEAP8[$83>>0]|0;
 $79 = $82;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSB_($94,$82);
 $78 = $86;
 $95 = $78;
 $76 = $95;
 $96 = $76;
 $75 = $96;
 $97 = $75;
 $74 = $97;
 $98 = $74;
 $73 = $98;
 $99 = $73;
 $72 = $99;
 $100 = $72;
 $67 = $100;
 $101 = $67;
 HEAP32[$97>>2] = $101;
 $102 = ((($97)) + 4|0);
 $70 = $97;
 $103 = $70;
 $69 = $103;
 $104 = $69;
 $68 = $104;
 $105 = $68;
 $71 = $105;
 $106 = $71;
 HEAP32[$102>>2] = $106;
 $107 = ((($96)) + 8|0);
 HEAP32[$77>>2] = 0;
 $65 = $107;
 $66 = $77;
 $108 = $65;
 $109 = $66;
 $64 = $109;
 $110 = $64;
 $60 = $108;
 $61 = $110;
 $111 = $60;
 $112 = $61;
 $59 = $112;
 $113 = $59;
 $114 = HEAP32[$113>>2]|0;
 HEAP32[$111>>2] = $114;
 $63 = $108;
 $115 = $63;
 $62 = $115;
 $87 = 0;
 $88 = 0;
 while(1) {
  $116 = $88;
  $58 = $1;
  $117 = $58;
  $57 = $117;
  $118 = $57;
  $56 = $118;
  $119 = $56;
  $55 = $119;
  $120 = $55;
  $54 = $120;
  $121 = $54;
  $122 = ((($121)) + 11|0);
  $123 = HEAP8[$122>>0]|0;
  $124 = $123&255;
  $125 = $124 & 128;
  $126 = ($125|0)!=(0);
  if ($126) {
   $50 = $118;
   $127 = $50;
   $49 = $127;
   $128 = $49;
   $48 = $128;
   $129 = $48;
   $130 = ((($129)) + 4|0);
   $131 = HEAP32[$130>>2]|0;
   $139 = $131;
  } else {
   $53 = $118;
   $132 = $53;
   $52 = $132;
   $133 = $52;
   $51 = $133;
   $134 = $51;
   $135 = ((($134)) + 11|0);
   $136 = HEAP8[$135>>0]|0;
   $137 = $136&255;
   $139 = $137;
  }
  $138 = (($139>>>0) / 2)&-1;
  $140 = ($116>>>0)<($138>>>0);
  if (!($140)) {
   break;
  }
  $141 = $88;
  $142 = $141<<1;
  $46 = $1;
  $47 = $142;
  $143 = $46;
  $45 = $143;
  $144 = $45;
  $44 = $144;
  $145 = $44;
  $43 = $145;
  $146 = $43;
  $42 = $146;
  $147 = $42;
  $148 = ((($147)) + 11|0);
  $149 = HEAP8[$148>>0]|0;
  $150 = $149&255;
  $151 = $150 & 128;
  $152 = ($151|0)!=(0);
  if ($152) {
   $36 = $144;
   $153 = $36;
   $35 = $153;
   $154 = $35;
   $34 = $154;
   $155 = $34;
   $156 = HEAP32[$155>>2]|0;
   $164 = $156;
  } else {
   $41 = $144;
   $157 = $41;
   $40 = $157;
   $158 = $40;
   $39 = $158;
   $159 = $39;
   $38 = $159;
   $160 = $38;
   $37 = $160;
   $161 = $37;
   $164 = $161;
  }
  $162 = $47;
  $163 = (($164) + ($162)|0);
  $165 = HEAP8[$163>>0]|0;
  $89 = $165;
  $166 = $88;
  $167 = $166<<1;
  $168 = (($167) + 1)|0;
  $32 = $1;
  $33 = $168;
  $169 = $32;
  $31 = $169;
  $170 = $31;
  $30 = $170;
  $171 = $30;
  $29 = $171;
  $172 = $29;
  $28 = $172;
  $173 = $28;
  $174 = ((($173)) + 11|0);
  $175 = HEAP8[$174>>0]|0;
  $176 = $175&255;
  $177 = $176 & 128;
  $178 = ($177|0)!=(0);
  if ($178) {
   $22 = $170;
   $179 = $22;
   $21 = $179;
   $180 = $21;
   $20 = $180;
   $181 = $20;
   $182 = HEAP32[$181>>2]|0;
   $190 = $182;
  } else {
   $27 = $170;
   $183 = $27;
   $26 = $183;
   $184 = $26;
   $25 = $184;
   $185 = $25;
   $24 = $185;
   $186 = $24;
   $23 = $186;
   $187 = $23;
   $190 = $187;
  }
  $188 = $33;
  $189 = (($190) + ($188)|0);
  $191 = HEAP8[$189>>0]|0;
  $90 = $191;
  $192 = $89;
  $193 = $192 << 24 >> 24;
  $194 = $84;
  $195 = $194 << 24 >> 24;
  $196 = ($193|0)==($195|0);
  if ($196) {
   $197 = $90;
   $198 = $197 << 24 >> 24;
   $199 = ($198|0)==(72);
   if ($199) {
    $200 = $87;
    $201 = (($200) + 1)|0;
    $87 = $201;
   } else {
    label = 15;
   }
  } else {
   label = 15;
  }
  if ((label|0) == 15) {
   label = 0;
   $202 = $89;
   $203 = $90;
   __Z7AddCardRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEEcc($85,$202,$203);
  }
  $204 = $88;
  $205 = (($204) + 1)|0;
  $88 = $205;
 }
 $206 = $87;
 $207 = (__Z5checkRNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEEERNS_4listINS_12basic_stringIcNS_11char_traitsIcEES5_EENS4_ISI_EEEEiii($85,$86,$206,0,0)|0);
 $91 = $207;
 $208 = $91;
 HEAP32[$0>>2] = $208;
 $209 = ((($0)) + 4|0);
 $8 = $86;
 $210 = $8;
 $6 = $210;
 $211 = $6;
 $212 = ((($211)) + 4|0);
 $213 = HEAP32[$212>>2]|0;
 $3 = $5;
 $4 = $213;
 $214 = $3;
 $215 = $4;
 HEAP32[$214>>2] = $215;
 $216 = HEAP32[$5>>2]|0;
 HEAP32[$7>>2] = $216;
 $217 = HEAP32[$7>>2]|0;
 HEAP32[$92>>2] = $217;
 $19 = $86;
 $218 = $19;
 $17 = $218;
 $219 = $17;
 $15 = $219;
 $220 = $15;
 $14 = $220;
 $221 = $14;
 $13 = $221;
 $222 = $13;
 $12 = $222;
 $223 = $12;
 $11 = $223;
 $224 = $11;
 $9 = $16;
 $10 = $224;
 $225 = $9;
 $226 = $10;
 HEAP32[$225>>2] = $226;
 $227 = HEAP32[$16>>2]|0;
 HEAP32[$18>>2] = $227;
 $228 = HEAP32[$18>>2]|0;
 HEAP32[$93>>2] = $228;
 ;HEAP32[$$byval_copy>>2]=HEAP32[$92>>2]|0;
 ;HEAP32[$$byval_copy1>>2]=HEAP32[$93>>2]|0;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEEC2INS_15__list_iteratorIS6_PvEEEET_NS_9enable_ifIXaasr21__is_forward_iteratorISD_EE5valuesr16is_constructibleIS6_NS_15iterator_traitsISD_E9referenceEEE5valueESD_E4typeE($209,$$byval_copy,$$byval_copy1);
 __ZNSt3__24listINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($86);
 __ZNSt3__23mapIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEENS2_IiEENS4_INS_4pairIKiS6_EEEEED2Ev($85);
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEEC2INS_15__list_iteratorIS6_PvEEEET_NS_9enable_ifIXaasr21__is_forward_iteratorISD_EE5valuesr16is_constructibleIS6_NS_15iterator_traitsISD_E9referenceEEE5valueESD_E4typeE($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$byval_copy = 0, $$byval_copy1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 160|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(160|0);
 $$byval_copy1 = sp + 140|0;
 $$byval_copy = sp + 136|0;
 $9 = sp + 32|0;
 $10 = sp + 24|0;
 $11 = sp + 16|0;
 $12 = sp + 108|0;
 $13 = sp + 104|0;
 $14 = sp + 144|0;
 $15 = sp + 8|0;
 $16 = sp;
 $27 = sp + 60|0;
 $30 = sp + 48|0;
 $31 = sp + 44|0;
 $32 = sp + 40|0;
 $33 = sp + 36|0;
 $28 = $0;
 $34 = $28;
 $26 = $34;
 $35 = $26;
 $25 = $35;
 HEAP32[$35>>2] = 0;
 $36 = ((($35)) + 4|0);
 HEAP32[$36>>2] = 0;
 $37 = ((($35)) + 8|0);
 HEAP32[$27>>2] = 0;
 $23 = $37;
 $24 = $27;
 $38 = $23;
 $39 = $24;
 $22 = $39;
 $40 = $22;
 $18 = $38;
 $19 = $40;
 $41 = $18;
 $42 = $19;
 $17 = $42;
 HEAP32[$41>>2] = 0;
 $21 = $38;
 $43 = $21;
 $20 = $43;
 ;HEAP32[$30>>2]=HEAP32[$1>>2]|0;
 ;HEAP32[$31>>2]=HEAP32[$2>>2]|0;
 ;HEAP8[$15>>0]=HEAP8[$31>>0]|0;HEAP8[$15+1>>0]=HEAP8[$31+1>>0]|0;HEAP8[$15+2>>0]=HEAP8[$31+2>>0]|0;HEAP8[$15+3>>0]=HEAP8[$31+3>>0]|0;
 ;HEAP8[$16>>0]=HEAP8[$30>>0]|0;HEAP8[$16+1>>0]=HEAP8[$30+1>>0]|0;HEAP8[$16+2>>0]=HEAP8[$30+2>>0]|0;HEAP8[$16+3>>0]=HEAP8[$30+3>>0]|0;
 ;HEAP32[$12>>2]=HEAP32[$16>>2]|0;
 ;HEAP32[$13>>2]=HEAP32[$15>>2]|0;
 ;HEAP8[$9>>0]=HEAP8[$14>>0]|0;
 ;HEAP8[$10>>0]=HEAP8[$13>>0]|0;HEAP8[$10+1>>0]=HEAP8[$13+1>>0]|0;HEAP8[$10+2>>0]=HEAP8[$13+2>>0]|0;HEAP8[$10+3>>0]=HEAP8[$13+3>>0]|0;
 ;HEAP8[$11>>0]=HEAP8[$12>>0]|0;HEAP8[$11+1>>0]=HEAP8[$12+1>>0]|0;HEAP8[$11+2>>0]=HEAP8[$12+2>>0]|0;HEAP8[$11+3>>0]=HEAP8[$12+3>>0]|0;
 $8 = 0;
 while(1) {
  $6 = $11;
  $7 = $10;
  $44 = $6;
  $45 = $7;
  $4 = $44;
  $5 = $45;
  $46 = $4;
  $47 = HEAP32[$46>>2]|0;
  $48 = $5;
  $49 = HEAP32[$48>>2]|0;
  $50 = ($47|0)==($49|0);
  $51 = $50 ^ 1;
  $52 = $8;
  if (!($51)) {
   break;
  }
  $53 = (($52) + 1)|0;
  $8 = $53;
  $3 = $11;
  $54 = $3;
  $55 = HEAP32[$54>>2]|0;
  $56 = ((($55)) + 4|0);
  $57 = HEAP32[$56>>2]|0;
  HEAP32[$54>>2] = $57;
 }
 $29 = $52;
 $58 = $29;
 $59 = ($58>>>0)>(0);
 if (!($59)) {
  STACKTOP = sp;return;
 }
 $60 = $29;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8allocateEm($34,$60);
 ;HEAP32[$32>>2]=HEAP32[$1>>2]|0;
 ;HEAP32[$33>>2]=HEAP32[$2>>2]|0;
 $61 = $29;
 ;HEAP32[$$byval_copy>>2]=HEAP32[$32>>2]|0;
 ;HEAP32[$$byval_copy1>>2]=HEAP32[$33>>2]|0;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endINS_15__list_iteratorIS6_PvEEEENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESE_SE_m($34,$$byval_copy,$$byval_copy1,$61);
 STACKTOP = sp;return;
}
function ___cxx_global_var_init_15() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10emscripten38EmscriptenBindingInitializer_my_moduleC2Ev(8265);
 return;
}
function __ZN10emscripten38EmscriptenBindingInitializer_my_moduleC2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = sp + 4|0;
 $1 = $0;
 __ZN10emscripten8functionI14StrategyResultJNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEcEJEEEvPKcPFT_DpT0_EDpT1_(3874,30);
 __ZN10emscripten15register_vectorINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEEENS_6class_INS1_6vectorIT_NS5_ISA_EEEENS_8internal11NoBaseClassEEEPKc(3879);
 __ZN10emscripten12value_objectI14StrategyResultEC2EPKc($2,3894);
 $3 = (__ZN10emscripten12value_objectI14StrategyResultE5fieldIS1_iEERS2_PKcMT_T0_($2,3909,0)|0);
 (__ZN10emscripten12value_objectI14StrategyResultE5fieldIS1_NSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEERS2_PKcMT_T0_($3,3918,4)|0);
 __ZN10emscripten12value_objectI14StrategyResultED2Ev($2);
 STACKTOP = sp;return;
}
function __ZN10emscripten8functionI14StrategyResultJNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEcEJEEEvPKcPFT_DpT0_EDpT1_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $5 = sp + 16|0;
 $3 = $0;
 $4 = $1;
 $6 = 31;
 $7 = $3;
 $8 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJ14StrategyResultNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEcEE8getCountEv($5)|0);
 $9 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJ14StrategyResultNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEcEE8getTypesEv($5)|0);
 $10 = $6;
 $2 = $10;
 $11 = (__ZN10emscripten8internal19getGenericSignatureIJiiiiEEEPKcv()|0);
 $12 = $6;
 $13 = $4;
 __embind_register_function(($7|0),($8|0),($9|0),($11|0),($12|0),($13|0));
 STACKTOP = sp;return;
}
function __ZN10emscripten15register_vectorINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEEENS_6class_INS1_6vectorIT_NS5_ISA_EEEENS_8internal11NoBaseClassEEEPKc($0) {
 $0 = $0|0;
 var $$field = 0, $$field11 = 0, $$field14 = 0, $$field19 = 0, $$field22 = 0, $$field27 = 0, $$field30 = 0, $$field37 = 0, $$field40 = 0, $$field6 = 0, $$index1 = 0, $$index13 = 0, $$index17 = 0, $$index21 = 0, $$index25 = 0, $$index29 = 0, $$index3 = 0, $$index33 = 0, $$index35 = 0, $$index39 = 0;
 var $$index43 = 0, $$index5 = 0, $$index9 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0;
 var $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $14 = 0, $15 = 0;
 var $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0;
 var $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0;
 var $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0;
 var $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0;
 var $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 256|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(256|0);
 $4 = sp + 228|0;
 $5 = sp + 250|0;
 $10 = sp + 208|0;
 $11 = sp + 249|0;
 $16 = sp + 184|0;
 $18 = sp + 248|0;
 $19 = sp + 16|0;
 $23 = sp + 160|0;
 $25 = sp + 247|0;
 $26 = sp + 8|0;
 $30 = sp + 136|0;
 $32 = sp + 246|0;
 $33 = sp;
 $37 = sp + 245|0;
 $51 = sp + 56|0;
 $52 = sp + 48|0;
 $53 = sp + 244|0;
 $54 = sp + 40|0;
 $55 = sp + 32|0;
 $56 = sp + 24|0;
 $50 = $0;
 HEAP32[$51>>2] = (32);
 $$index1 = ((($51)) + 4|0);
 HEAP32[$$index1>>2] = 0;
 HEAP32[$52>>2] = (33);
 $$index3 = ((($52)) + 4|0);
 HEAP32[$$index3>>2] = 0;
 $57 = $50;
 $44 = $53;
 $45 = $57;
 __ZN10emscripten8internal11NoBaseClass6verifyINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEvv();
 $46 = 34;
 $58 = (__ZN10emscripten8internal11NoBaseClass11getUpcasterINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPFvvEv()|0);
 $47 = $58;
 $59 = (__ZN10emscripten8internal11NoBaseClass13getDowncasterINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPFvvEv()|0);
 $48 = $59;
 $49 = 35;
 $60 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $61 = (__ZN10emscripten8internal6TypeIDINS0_17AllowedRawPointerINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEE3getEv()|0);
 $62 = (__ZN10emscripten8internal6TypeIDINS0_17AllowedRawPointerIKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEE3getEv()|0);
 $63 = (__ZN10emscripten8internal11NoBaseClass3getEv()|0);
 $64 = $46;
 $43 = $64;
 $65 = (__ZN10emscripten8internal19getGenericSignatureIJiiEEEPKcv()|0);
 $66 = $46;
 $67 = $47;
 $42 = $67;
 $68 = (__ZN10emscripten8internal19getGenericSignatureIJvEEEPKcv()|0);
 $69 = $47;
 $70 = $48;
 $41 = $70;
 $71 = (__ZN10emscripten8internal19getGenericSignatureIJvEEEPKcv()|0);
 $72 = $48;
 $73 = $45;
 $74 = $49;
 $40 = $74;
 $75 = (__ZN10emscripten8internal19getGenericSignatureIJviEEEPKcv()|0);
 $76 = $49;
 __embind_register_class(($60|0),($61|0),($62|0),($63|0),($65|0),($66|0),($68|0),($69|0),($71|0),($72|0),($73|0),($75|0),($76|0));
 $39 = $53;
 $77 = $39;
 $35 = $77;
 $36 = 36;
 $78 = $35;
 $38 = 37;
 $79 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $80 = (__ZNK10emscripten8internal12WithPoliciesIJNS_18allow_raw_pointersEEE11ArgTypeListIJPNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEE8getCountEv($37)|0);
 $81 = (__ZNK10emscripten8internal12WithPoliciesIJNS_18allow_raw_pointersEEE11ArgTypeListIJPNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEE8getTypesEv($37)|0);
 $82 = $38;
 $34 = $82;
 $83 = (__ZN10emscripten8internal19getGenericSignatureIJiiEEEPKcv()|0);
 $84 = $38;
 $85 = $36;
 __embind_register_class_constructor(($79|0),($80|0),($81|0),($83|0),($84|0),($85|0));
 $$field = HEAP32[$51>>2]|0;
 $$index5 = ((($51)) + 4|0);
 $$field6 = HEAP32[$$index5>>2]|0;
 HEAP32[$54>>2] = $$field;
 $$index9 = ((($54)) + 4|0);
 HEAP32[$$index9>>2] = $$field6;
 ;HEAP8[$33>>0]=HEAP8[$54>>0]|0;HEAP8[$33+1>>0]=HEAP8[$54+1>>0]|0;HEAP8[$33+2>>0]=HEAP8[$54+2>>0]|0;HEAP8[$33+3>>0]=HEAP8[$54+3>>0]|0;HEAP8[$33+4>>0]=HEAP8[$54+4>>0]|0;HEAP8[$33+5>>0]=HEAP8[$54+5>>0]|0;HEAP8[$33+6>>0]=HEAP8[$54+6>>0]|0;HEAP8[$33+7>>0]=HEAP8[$54+7>>0]|0;
 $$field11 = HEAP32[$33>>2]|0;
 $$index13 = ((($33)) + 4|0);
 $$field14 = HEAP32[$$index13>>2]|0;
 $28 = $78;
 $29 = 4119;
 HEAP32[$30>>2] = $$field11;
 $$index17 = ((($30)) + 4|0);
 HEAP32[$$index17>>2] = $$field14;
 $86 = $28;
 $31 = 38;
 $87 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $88 = $29;
 $89 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEERKSC_EE8getCountEv($32)|0);
 $90 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEERKSC_EE8getTypesEv($32)|0);
 $91 = $31;
 $27 = $91;
 $92 = (__ZN10emscripten8internal19getGenericSignatureIJviiiEEEPKcv()|0);
 $93 = $31;
 $94 = (__ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvRKS9_EEEPT_RKSG_($30)|0);
 __embind_register_class_function(($87|0),($88|0),($89|0),($90|0),($92|0),($93|0),($94|0),0);
 $$field19 = HEAP32[$52>>2]|0;
 $$index21 = ((($52)) + 4|0);
 $$field22 = HEAP32[$$index21>>2]|0;
 HEAP32[$55>>2] = $$field19;
 $$index25 = ((($55)) + 4|0);
 HEAP32[$$index25>>2] = $$field22;
 ;HEAP8[$26>>0]=HEAP8[$55>>0]|0;HEAP8[$26+1>>0]=HEAP8[$55+1>>0]|0;HEAP8[$26+2>>0]=HEAP8[$55+2>>0]|0;HEAP8[$26+3>>0]=HEAP8[$55+3>>0]|0;HEAP8[$26+4>>0]=HEAP8[$55+4>>0]|0;HEAP8[$26+5>>0]=HEAP8[$55+5>>0]|0;HEAP8[$26+6>>0]=HEAP8[$55+6>>0]|0;HEAP8[$26+7>>0]=HEAP8[$55+7>>0]|0;
 $$field27 = HEAP32[$26>>2]|0;
 $$index29 = ((($26)) + 4|0);
 $$field30 = HEAP32[$$index29>>2]|0;
 $21 = $86;
 $22 = 4129;
 HEAP32[$23>>2] = $$field27;
 $$index33 = ((($23)) + 4|0);
 HEAP32[$$index33>>2] = $$field30;
 $95 = $21;
 $24 = 39;
 $96 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $97 = $22;
 $98 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEmRKSC_EE8getCountEv($25)|0);
 $99 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEmRKSC_EE8getTypesEv($25)|0);
 $100 = $24;
 $20 = $100;
 $101 = (__ZN10emscripten8internal19getGenericSignatureIJviiiiEEEPKcv()|0);
 $102 = $24;
 $103 = (__ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvmRKS9_EEEPT_RKSG_($23)|0);
 __embind_register_class_function(($96|0),($97|0),($98|0),($99|0),($101|0),($102|0),($103|0),0);
 HEAP32[$56>>2] = (40);
 $$index35 = ((($56)) + 4|0);
 HEAP32[$$index35>>2] = 0;
 ;HEAP8[$19>>0]=HEAP8[$56>>0]|0;HEAP8[$19+1>>0]=HEAP8[$56+1>>0]|0;HEAP8[$19+2>>0]=HEAP8[$56+2>>0]|0;HEAP8[$19+3>>0]=HEAP8[$56+3>>0]|0;HEAP8[$19+4>>0]=HEAP8[$56+4>>0]|0;HEAP8[$19+5>>0]=HEAP8[$56+5>>0]|0;HEAP8[$19+6>>0]=HEAP8[$56+6>>0]|0;HEAP8[$19+7>>0]=HEAP8[$56+7>>0]|0;
 $$field37 = HEAP32[$19>>2]|0;
 $$index39 = ((($19)) + 4|0);
 $$field40 = HEAP32[$$index39>>2]|0;
 $14 = $95;
 $15 = 4136;
 HEAP32[$16>>2] = $$field37;
 $$index43 = ((($16)) + 4|0);
 HEAP32[$$index43>>2] = $$field40;
 $104 = $14;
 $17 = 41;
 $105 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $106 = $15;
 $107 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEEE8getCountEv($18)|0);
 $108 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEEE8getTypesEv($18)|0);
 $109 = $17;
 $13 = $109;
 $110 = (__ZN10emscripten8internal19getGenericSignatureIJiiiEEEPKcv()|0);
 $111 = $17;
 $112 = (__ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEKFmvEEEPT_RKSE_($16)|0);
 __embind_register_class_function(($105|0),($106|0),($107|0),($108|0),($110|0),($111|0),($112|0),0);
 $8 = $104;
 $9 = 4141;
 HEAP32[$10>>2] = 42;
 $113 = $8;
 $12 = 43;
 $114 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $115 = $9;
 $116 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJNS_3valERKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEmEE8getCountEv($11)|0);
 $117 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJNS_3valERKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEmEE8getTypesEv($11)|0);
 $118 = $12;
 $7 = $118;
 $119 = (__ZN10emscripten8internal19getGenericSignatureIJiiiiEEEPKcv()|0);
 $120 = $12;
 $121 = (__ZN10emscripten8internal10getContextIPFNS_3valERKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmEEEPT_RKSH_($10)|0);
 __embind_register_class_function(($114|0),($115|0),($116|0),($117|0),($119|0),($120|0),($121|0),0);
 $2 = $113;
 $3 = 4145;
 HEAP32[$4>>2] = 44;
 $6 = 45;
 $122 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $123 = $3;
 $124 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJbRNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmRKSB_EE8getCountEv($5)|0);
 $125 = (__ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJbRNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmRKSB_EE8getTypesEv($5)|0);
 $126 = $6;
 $1 = $126;
 $127 = (__ZN10emscripten8internal19getGenericSignatureIJiiiiiEEEPKcv()|0);
 $128 = $6;
 $129 = (__ZN10emscripten8internal10getContextIPFbRNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEmRKS9_EEEPT_RKSH_($4)|0);
 __embind_register_class_function(($122|0),($123|0),($124|0),($125|0),($127|0),($128|0),($129|0),0);
 STACKTOP = sp;return;
}
function __ZN10emscripten12value_objectI14StrategyResultEC2EPKc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $4 = $0;
 $5 = $1;
 $8 = $4;
 __ZN10emscripten8internal11noncopyableC2Ev($8);
 $6 = 46;
 $7 = 47;
 $9 = (__ZN10emscripten8internal6TypeIDI14StrategyResultE3getEv()|0);
 $10 = $5;
 $11 = $6;
 $3 = $11;
 $12 = (__ZN10emscripten8internal19getGenericSignatureIJiEEEPKcv()|0);
 $13 = $6;
 $14 = $7;
 $2 = $14;
 $15 = (__ZN10emscripten8internal19getGenericSignatureIJviEEEPKcv()|0);
 $16 = $7;
 __embind_register_value_object(($9|0),($10|0),($12|0),($13|0),($15|0),($16|0));
 STACKTOP = sp;return;
}
function __ZN10emscripten12value_objectI14StrategyResultE5fieldIS1_iEERS2_PKcMT_T0_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = sp + 8|0;
 $5 = $0;
 $6 = $1;
 HEAP32[$7>>2] = $2;
 $10 = $5;
 $8 = 48;
 $9 = 49;
 $11 = (__ZN10emscripten8internal6TypeIDI14StrategyResultE3getEv()|0);
 $12 = $6;
 $13 = (__ZN10emscripten8internal6TypeIDIiE3getEv()|0);
 $14 = $8;
 $4 = $14;
 $15 = (__ZN10emscripten8internal19getGenericSignatureIJiiiEEEPKcv()|0);
 $16 = $8;
 $17 = (__ZN10emscripten8internal10getContextIM14StrategyResultiEEPT_RKS4_($7)|0);
 $18 = (__ZN10emscripten8internal6TypeIDIiE3getEv()|0);
 $19 = $9;
 $3 = $19;
 $20 = (__ZN10emscripten8internal19getGenericSignatureIJviiiEEEPKcv()|0);
 $21 = $9;
 $22 = (__ZN10emscripten8internal10getContextIM14StrategyResultiEEPT_RKS4_($7)|0);
 __embind_register_value_object_field(($11|0),($12|0),($13|0),($15|0),($16|0),($17|0),($18|0),($20|0),($21|0),($22|0));
 STACKTOP = sp;return ($10|0);
}
function __ZN10emscripten12value_objectI14StrategyResultE5fieldIS1_NSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEERS2_PKcMT_T0_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = sp + 8|0;
 $5 = $0;
 $6 = $1;
 HEAP32[$7>>2] = $2;
 $10 = $5;
 $8 = 50;
 $9 = 51;
 $11 = (__ZN10emscripten8internal6TypeIDI14StrategyResultE3getEv()|0);
 $12 = $6;
 $13 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $14 = $8;
 $4 = $14;
 $15 = (__ZN10emscripten8internal19getGenericSignatureIJiiiEEEPKcv()|0);
 $16 = $8;
 $17 = (__ZN10emscripten8internal10getContextIM14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPT_RKSE_($7)|0);
 $18 = (__ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 $19 = $9;
 $3 = $19;
 $20 = (__ZN10emscripten8internal19getGenericSignatureIJviiiEEEPKcv()|0);
 $21 = $9;
 $22 = (__ZN10emscripten8internal10getContextIM14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPT_RKSE_($7)|0);
 __embind_register_value_object_field(($11|0),($12|0),($13|0),($15|0),($16|0),($17|0),($18|0),($20|0),($21|0),($22|0));
 STACKTOP = sp;return ($10|0);
}
function __ZN10emscripten12value_objectI14StrategyResultED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = (__ZN10emscripten8internal6TypeIDI14StrategyResultE3getEv()|0);
 __embind_finalize_value_object(($3|0));
 __ZN10emscripten8internal11noncopyableD2Ev($2);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = $0;
 $8 = $7;
 $6 = $8;
 $9 = $6;
 $5 = $9;
 $10 = $5;
 $11 = ((($10)) + 4|0);
 $4 = $11;
 $12 = $4;
 $3 = $12;
 $13 = $3;
 $2 = $13;
 $14 = $2;
 $1 = $14;
 $15 = $1;
 $16 = HEAP32[$15>>2]|0;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE7destroyEPNS_11__tree_nodeIS8_PvEE($8,$16);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE7destroyEPNS_11__tree_nodeIS8_PvEE($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $4 = sp;
 $7 = sp + 80|0;
 $20 = $0;
 $21 = $1;
 $23 = $20;
 $24 = $21;
 $25 = ($24|0)!=(0|0);
 if (!($25)) {
  STACKTOP = sp;return;
 }
 $26 = $21;
 $27 = HEAP32[$26>>2]|0;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE7destroyEPNS_11__tree_nodeIS8_PvEE($23,$27);
 $28 = $21;
 $29 = ((($28)) + 4|0);
 $30 = HEAP32[$29>>2]|0;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE7destroyEPNS_11__tree_nodeIS8_PvEE($23,$30);
 $12 = $23;
 $31 = $12;
 $32 = ((($31)) + 4|0);
 $11 = $32;
 $33 = $11;
 $10 = $33;
 $34 = $10;
 $22 = $34;
 $35 = $22;
 $36 = $21;
 $37 = ((($36)) + 16|0);
 $9 = $37;
 $38 = $9;
 $8 = $38;
 $39 = $8;
 $5 = $35;
 $6 = $39;
 $40 = $5;
 $41 = $6;
 ;HEAP8[$4>>0]=HEAP8[$7>>0]|0;
 $2 = $40;
 $3 = $41;
 $42 = $3;
 __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($42);
 $43 = $22;
 $44 = $21;
 $17 = $43;
 $18 = $44;
 $19 = 1;
 $45 = $17;
 $46 = $18;
 $47 = $19;
 $14 = $45;
 $15 = $46;
 $16 = $47;
 $48 = $15;
 $13 = $48;
 $49 = $13;
 __ZdlPv($49);
 STACKTOP = sp;return;
}
function ___clang_call_terminate($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 (___cxa_begin_catch(($0|0))|0);
 __ZSt9terminatev();
 // unreachable;
}
function __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ((($2)) + 4|0);
 __ZNSt3__28multisetIcNS_4lessIcEENS_9allocatorIcEEED2Ev($3);
 STACKTOP = sp;return;
}
function __ZNSt3__28multisetIcNS_4lessIcEENS_9allocatorIcEEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEED2Ev($2);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = $0;
 $8 = $7;
 $6 = $8;
 $9 = $6;
 $5 = $9;
 $10 = $5;
 $11 = ((($10)) + 4|0);
 $4 = $11;
 $12 = $4;
 $3 = $12;
 $13 = $3;
 $2 = $13;
 $14 = $2;
 $1 = $14;
 $15 = $1;
 $16 = HEAP32[$15>>2]|0;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE7destroyEPNS_11__tree_nodeIcPvEE($8,$16);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE7destroyEPNS_11__tree_nodeIcPvEE($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $4 = sp;
 $7 = sp + 80|0;
 $20 = $0;
 $21 = $1;
 $23 = $20;
 $24 = $21;
 $25 = ($24|0)!=(0|0);
 if (!($25)) {
  STACKTOP = sp;return;
 }
 $26 = $21;
 $27 = HEAP32[$26>>2]|0;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE7destroyEPNS_11__tree_nodeIcPvEE($23,$27);
 $28 = $21;
 $29 = ((($28)) + 4|0);
 $30 = HEAP32[$29>>2]|0;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE7destroyEPNS_11__tree_nodeIcPvEE($23,$30);
 $12 = $23;
 $31 = $12;
 $32 = ((($31)) + 4|0);
 $11 = $32;
 $33 = $11;
 $10 = $33;
 $34 = $10;
 $22 = $34;
 $35 = $22;
 $36 = $21;
 $37 = ((($36)) + 13|0);
 $9 = $37;
 $38 = $9;
 $8 = $38;
 $39 = $8;
 $5 = $35;
 $6 = $39;
 $40 = $5;
 $41 = $6;
 ;HEAP8[$4>>0]=HEAP8[$7>>0]|0;
 $2 = $40;
 $3 = $41;
 $42 = $22;
 $43 = $21;
 $17 = $42;
 $18 = $43;
 $19 = 1;
 $44 = $17;
 $45 = $18;
 $46 = $19;
 $14 = $44;
 $15 = $45;
 $16 = $46;
 $47 = $15;
 $13 = $47;
 $48 = $13;
 __ZdlPv($48);
 STACKTOP = sp;return;
}
function __ZNSt3__210__list_impINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 __ZNSt3__210__list_impINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE5clearEv($2);
 STACKTOP = sp;return;
}
function __ZNSt3__210__list_impINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE5clearEv($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0;
 var $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0;
 var $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0;
 var $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0;
 var $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 176|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(176|0);
 $13 = sp;
 $16 = sp + 160|0;
 $37 = $0;
 $42 = $37;
 $36 = $42;
 $43 = $36;
 $35 = $43;
 $44 = $35;
 $45 = ((($44)) + 8|0);
 $34 = $45;
 $46 = $34;
 $33 = $46;
 $47 = $33;
 $48 = HEAP32[$47>>2]|0;
 $49 = ($48|0)==(0);
 if ($49) {
  STACKTOP = sp;return;
 }
 $32 = $42;
 $50 = $32;
 $51 = ((($50)) + 8|0);
 $31 = $51;
 $52 = $31;
 $30 = $52;
 $53 = $30;
 $38 = $53;
 $54 = ((($42)) + 4|0);
 $55 = HEAP32[$54>>2]|0;
 $39 = $55;
 $21 = $42;
 $56 = $21;
 $20 = $56;
 $57 = $20;
 $19 = $57;
 $58 = $19;
 $18 = $58;
 $59 = $18;
 $17 = $59;
 $60 = $17;
 $40 = $60;
 $61 = $39;
 $62 = $40;
 $63 = HEAP32[$62>>2]|0;
 $9 = $61;
 $10 = $63;
 $64 = $10;
 $65 = ((($64)) + 4|0);
 $66 = HEAP32[$65>>2]|0;
 $67 = $9;
 $68 = HEAP32[$67>>2]|0;
 $69 = ((($68)) + 4|0);
 HEAP32[$69>>2] = $66;
 $70 = $9;
 $71 = HEAP32[$70>>2]|0;
 $72 = $10;
 $73 = ((($72)) + 4|0);
 $74 = HEAP32[$73>>2]|0;
 HEAP32[$74>>2] = $71;
 $3 = $42;
 $75 = $3;
 $76 = ((($75)) + 8|0);
 $2 = $76;
 $77 = $2;
 $1 = $77;
 $78 = $1;
 HEAP32[$78>>2] = 0;
 while(1) {
  $79 = $39;
  $80 = $40;
  $81 = ($79|0)!=($80|0);
  if (!($81)) {
   break;
  }
  $82 = $39;
  $7 = $82;
  $83 = $7;
  $6 = $83;
  $84 = $6;
  $5 = $84;
  $85 = $5;
  $4 = $85;
  $86 = $4;
  $41 = $86;
  $87 = $39;
  $88 = ((($87)) + 4|0);
  $89 = HEAP32[$88>>2]|0;
  $39 = $89;
  $90 = $38;
  $91 = $41;
  $92 = ((($91)) + 8|0);
  $8 = $92;
  $93 = $8;
  $14 = $90;
  $15 = $93;
  $94 = $14;
  $95 = $15;
  ;HEAP8[$13>>0]=HEAP8[$16>>0]|0;
  $11 = $94;
  $12 = $95;
  $96 = $12;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($96);
  $97 = $38;
  $98 = $41;
  $26 = $97;
  $27 = $98;
  $28 = 1;
  $99 = $26;
  $100 = $27;
  $101 = $28;
  $23 = $99;
  $24 = $100;
  $25 = $101;
  $102 = $24;
  $22 = $102;
  $103 = $22;
  __ZdlPv($103);
 }
 $29 = $42;
 STACKTOP = sp;return;
}
function __ZNSt3__211char_traitsIcE6lengthEPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = (_strlen($2)|0);
 STACKTOP = sp;return ($3|0);
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE25__emplace_unique_key_argsIiJRKNS_21piecewise_construct_tENS_5tupleIJRKiEEENSI_IJEEEEEENS_4pairINS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEEbEERKT_DpOT0_($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0;
 var $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $50 = 0, $51 = 0, $52 = 0;
 var $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0;
 var $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0;
 var $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 240|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(240|0);
 $28 = sp;
 $31 = sp + 229|0;
 $57 = sp + 28|0;
 $60 = sp + 228|0;
 $61 = sp + 8|0;
 $62 = sp + 4|0;
 $52 = $1;
 $53 = $2;
 $54 = $3;
 $55 = $4;
 $56 = $5;
 $63 = $52;
 $64 = $53;
 $65 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEERPNS_15__tree_end_nodeISI_EERKT_($63,$57,$64)|0);
 $58 = $65;
 $66 = $58;
 $67 = HEAP32[$66>>2]|0;
 $59 = $67;
 HEAP8[$60>>0] = 0;
 $68 = $58;
 $69 = HEAP32[$68>>2]|0;
 $70 = ($69|0)==(0|0);
 if ($70) {
  $71 = $54;
  $51 = $71;
  $72 = $51;
  $73 = $55;
  $43 = $73;
  $74 = $43;
  $75 = $56;
  $42 = $75;
  $76 = $42;
  __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_21piecewise_construct_tENS_5tupleIJRKiEEENSI_IJEEEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISQ_EEEEEEDpOT_($61,$63,$72,$74,$76);
  $77 = HEAP32[$57>>2]|0;
  $78 = $58;
  $14 = $61;
  $79 = $14;
  $13 = $79;
  $80 = $13;
  $12 = $80;
  $81 = $12;
  $82 = HEAP32[$81>>2]|0;
  __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSI_SI_($63,$77,$78,$82);
  $10 = $61;
  $83 = $10;
  $9 = $83;
  $84 = $9;
  $8 = $84;
  $85 = $8;
  $86 = HEAP32[$85>>2]|0;
  $11 = $86;
  $7 = $83;
  $87 = $7;
  $6 = $87;
  $88 = $6;
  HEAP32[$88>>2] = 0;
  $89 = $11;
  $59 = $89;
  HEAP8[$60>>0] = 1;
  $41 = $61;
  $90 = $41;
  $38 = $90;
  $39 = 0;
  $91 = $38;
  $37 = $91;
  $92 = $37;
  $36 = $92;
  $93 = $36;
  $94 = HEAP32[$93>>2]|0;
  $40 = $94;
  $95 = $39;
  $18 = $91;
  $96 = $18;
  $17 = $96;
  $97 = $17;
  HEAP32[$97>>2] = $95;
  $98 = $40;
  $99 = ($98|0)!=(0|0);
  if ($99) {
   $16 = $91;
   $100 = $16;
   $101 = ((($100)) + 4|0);
   $15 = $101;
   $102 = $15;
   $103 = $40;
   $34 = $102;
   $35 = $103;
   $104 = $34;
   $105 = ((($104)) + 4|0);
   $106 = HEAP8[$105>>0]|0;
   $107 = $106&1;
   if ($107) {
    $108 = HEAP32[$104>>2]|0;
    $109 = $35;
    $110 = ((($109)) + 16|0);
    $33 = $110;
    $111 = $33;
    $32 = $111;
    $112 = $32;
    $29 = $108;
    $30 = $112;
    $113 = $29;
    $114 = $30;
    ;HEAP8[$28>>0]=HEAP8[$31>>0]|0;
    $26 = $113;
    $27 = $114;
    $115 = $27;
    __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($115);
   }
   $116 = $35;
   $117 = ($116|0)!=(0|0);
   if ($117) {
    $118 = HEAP32[$104>>2]|0;
    $119 = $35;
    $23 = $118;
    $24 = $119;
    $25 = 1;
    $120 = $23;
    $121 = $24;
    $122 = $25;
    $20 = $120;
    $21 = $121;
    $22 = $122;
    $123 = $21;
    $19 = $123;
    $124 = $19;
    __ZdlPv($124);
   }
  }
 }
 $125 = $59;
 $44 = $62;
 $45 = $125;
 $126 = $44;
 $127 = $45;
 HEAP32[$126>>2] = $127;
 $48 = $0;
 $49 = $62;
 $50 = $60;
 $128 = $48;
 $129 = $49;
 $47 = $129;
 $130 = $47;
 ;HEAP32[$128>>2]=HEAP32[$130>>2]|0;
 $131 = ((($128)) + 4|0);
 $132 = $50;
 $46 = $132;
 $133 = $46;
 $134 = HEAP8[$133>>0]|0;
 $135 = $134&1;
 $136 = $135&1;
 HEAP8[$131>>0] = $136;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEERPNS_15__tree_end_nodeISI_EERKT_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $12 = 0;
 var $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0;
 var $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0;
 var $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0;
 var $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0;
 var $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 160|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(160|0);
 $35 = $0;
 $36 = $1;
 $37 = $2;
 $40 = $35;
 $33 = $40;
 $41 = $33;
 $32 = $41;
 $42 = $32;
 $43 = ((($42)) + 4|0);
 $31 = $43;
 $44 = $31;
 $30 = $44;
 $45 = $30;
 $29 = $45;
 $46 = $29;
 $28 = $46;
 $47 = $28;
 $48 = HEAP32[$47>>2]|0;
 $38 = $48;
 $49 = (__ZNKSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE10__root_ptrEv($40)|0);
 $39 = $49;
 $50 = $38;
 $51 = ($50|0)!=(0|0);
 if (!($51)) {
  $27 = $40;
  $107 = $27;
  $108 = ((($107)) + 4|0);
  $26 = $108;
  $109 = $26;
  $25 = $109;
  $110 = $25;
  $24 = $110;
  $111 = $24;
  $23 = $111;
  $112 = $23;
  $113 = $36;
  HEAP32[$113>>2] = $112;
  $114 = $36;
  $115 = HEAP32[$114>>2]|0;
  $34 = $115;
  $116 = $34;
  STACKTOP = sp;return ($116|0);
 }
 while(1) {
  $5 = $40;
  $52 = $5;
  $53 = ((($52)) + 8|0);
  $4 = $53;
  $54 = $4;
  $3 = $54;
  $55 = $3;
  $56 = $37;
  $57 = $38;
  $58 = ((($57)) + 16|0);
  $9 = $55;
  $10 = $56;
  $11 = $58;
  $59 = $9;
  $60 = $10;
  $61 = $11;
  $6 = $59;
  $7 = $60;
  $8 = $61;
  $62 = $7;
  $63 = HEAP32[$62>>2]|0;
  $64 = $8;
  $65 = HEAP32[$64>>2]|0;
  $66 = ($63|0)<($65|0);
  if ($66) {
   $67 = $38;
   $68 = HEAP32[$67>>2]|0;
   $69 = ($68|0)!=(0|0);
   $70 = $38;
   if (!($69)) {
    label = 6;
    break;
   }
   $12 = $70;
   $71 = $12;
   $39 = $71;
   $72 = $38;
   $73 = HEAP32[$72>>2]|0;
   $38 = $73;
  } else {
   $15 = $40;
   $77 = $15;
   $78 = ((($77)) + 8|0);
   $14 = $78;
   $79 = $14;
   $13 = $79;
   $80 = $13;
   $81 = $38;
   $82 = ((($81)) + 16|0);
   $83 = $37;
   $19 = $80;
   $20 = $82;
   $21 = $83;
   $84 = $19;
   $85 = $20;
   $86 = $21;
   $16 = $84;
   $17 = $85;
   $18 = $86;
   $87 = $17;
   $88 = HEAP32[$87>>2]|0;
   $89 = $18;
   $90 = HEAP32[$89>>2]|0;
   $91 = ($88|0)<($90|0);
   $92 = $38;
   if (!($91)) {
    label = 11;
    break;
   }
   $93 = ((($92)) + 4|0);
   $94 = HEAP32[$93>>2]|0;
   $95 = ($94|0)!=(0|0);
   $96 = $38;
   if (!($95)) {
    label = 10;
    break;
   }
   $97 = ((($96)) + 4|0);
   $22 = $97;
   $98 = $22;
   $39 = $98;
   $99 = $38;
   $100 = ((($99)) + 4|0);
   $101 = HEAP32[$100>>2]|0;
   $38 = $101;
  }
 }
 if ((label|0) == 6) {
  $74 = $36;
  HEAP32[$74>>2] = $70;
  $75 = $36;
  $76 = HEAP32[$75>>2]|0;
  $34 = $76;
  $116 = $34;
  STACKTOP = sp;return ($116|0);
 }
 else if ((label|0) == 10) {
  $102 = $36;
  HEAP32[$102>>2] = $96;
  $103 = $38;
  $104 = ((($103)) + 4|0);
  $34 = $104;
  $116 = $34;
  STACKTOP = sp;return ($116|0);
 }
 else if ((label|0) == 11) {
  $105 = $36;
  HEAP32[$105>>2] = $92;
  $106 = $39;
  $34 = $106;
  $116 = $34;
  STACKTOP = sp;return ($116|0);
 }
 return (0)|0;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_21piecewise_construct_tENS_5tupleIJRKiEEENSI_IJEEEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISQ_EEEEEEDpOT_($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0;
 var $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0;
 var $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0;
 var $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0;
 var $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0;
 var $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0;
 var $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0;
 var $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0;
 var $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 512|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(512|0);
 $16 = sp + 497|0;
 $22 = sp + 56|0;
 $23 = sp + 48|0;
 $24 = sp + 40|0;
 $26 = sp + 496|0;
 $27 = sp + 495|0;
 $28 = sp + 494|0;
 $29 = sp + 32|0;
 $30 = sp + 24|0;
 $31 = sp + 16|0;
 $38 = sp + 493|0;
 $39 = sp + 392|0;
 $40 = sp + 492|0;
 $47 = sp + 8|0;
 $54 = sp + 491|0;
 $76 = sp + 256|0;
 $104 = sp;
 $107 = sp + 489|0;
 $126 = sp + 488|0;
 $127 = sp + 64|0;
 $121 = $1;
 $122 = $2;
 $123 = $3;
 $124 = $4;
 $128 = $121;
 $120 = $128;
 $129 = $120;
 $130 = ((($129)) + 4|0);
 $119 = $130;
 $131 = $119;
 $118 = $131;
 $132 = $118;
 $125 = $132;
 $$expand_i1_val = 0;
 HEAP8[$126>>0] = $$expand_i1_val;
 $133 = $125;
 $89 = $133;
 $90 = 1;
 $134 = $89;
 $135 = $90;
 $86 = $134;
 $87 = $135;
 $88 = 0;
 $136 = $86;
 $137 = $87;
 $85 = $136;
 $138 = ($137>>>0)>(134217727);
 if ($138) {
  $83 = 3928;
  $139 = (___cxa_allocate_exception(8)|0);
  $140 = $83;
  $81 = $139;
  $82 = $140;
  $141 = $81;
  $142 = $82;
  __ZNSt11logic_errorC2EPKc($141,$142);
  HEAP32[$141>>2] = (3644);
  ___cxa_throw(($139|0),(2792|0),(18|0));
  // unreachable;
 }
 $143 = $87;
 $144 = $143<<5;
 $84 = $144;
 $145 = $84;
 $146 = (__Znwm($145)|0);
 $147 = $125;
 $78 = $127;
 $79 = $147;
 $80 = 0;
 $148 = $78;
 $149 = $79;
 HEAP32[$148>>2] = $149;
 $150 = ((($148)) + 4|0);
 $151 = $80;
 $152 = $151&1;
 $153 = $152&1;
 HEAP8[$150>>0] = $153;
 $75 = $0;
 HEAP32[$76>>2] = $146;
 $77 = $127;
 $154 = $75;
 $155 = $77;
 $74 = $155;
 $156 = $74;
 $71 = $154;
 $72 = $76;
 $73 = $156;
 $157 = $71;
 $158 = $72;
 $70 = $158;
 $159 = $70;
 $64 = $157;
 $65 = $159;
 $160 = $64;
 $161 = $65;
 $63 = $161;
 $162 = $63;
 $163 = HEAP32[$162>>2]|0;
 HEAP32[$160>>2] = $163;
 $164 = ((($157)) + 4|0);
 $165 = $73;
 $66 = $165;
 $166 = $66;
 $68 = $164;
 $69 = $166;
 $167 = $68;
 $168 = $69;
 $67 = $168;
 $169 = $67;
 ;HEAP32[$167>>2]=HEAP32[$169>>2]|0;HEAP32[$167+4>>2]=HEAP32[$169+4>>2]|0;
 $170 = $125;
 $62 = $0;
 $171 = $62;
 $61 = $171;
 $172 = $61;
 $60 = $172;
 $173 = $60;
 $174 = HEAP32[$173>>2]|0;
 $175 = ((($174)) + 16|0);
 $59 = $175;
 $176 = $59;
 $58 = $176;
 $177 = $58;
 $178 = $122;
 $57 = $178;
 $179 = $57;
 $180 = $123;
 $56 = $180;
 $181 = $56;
 $182 = $124;
 $55 = $182;
 $183 = $55;
 $49 = $170;
 $50 = $177;
 $51 = $179;
 $52 = $181;
 $53 = $183;
 $184 = $49;
 $185 = $50;
 $186 = $51;
 $48 = $186;
 $187 = $48;
 $188 = $52;
 $9 = $188;
 $189 = $9;
 $190 = $53;
 $8 = $190;
 $191 = $8;
 ;HEAP8[$47>>0]=HEAP8[$54>>0]|0;
 $42 = $184;
 $43 = $185;
 $44 = $187;
 $45 = $189;
 $46 = $191;
 $192 = $42;
 $193 = $43;
 $194 = $44;
 $41 = $194;
 $195 = $41;
 $196 = $45;
 $11 = $196;
 $197 = $11;
 $198 = $46;
 $10 = $198;
 $199 = $10;
 $33 = $192;
 $34 = $193;
 $35 = $195;
 $36 = $197;
 $37 = $199;
 $200 = $34;
 $201 = $35;
 $32 = $201;
 $202 = $36;
 $13 = $202;
 $203 = $13;
 ;HEAP32[$39>>2]=HEAP32[$203>>2]|0;
 $204 = $37;
 $12 = $204;
 ;HEAP8[$29>>0]=HEAP8[$40>>0]|0;
 ;HEAP8[$30>>0]=HEAP8[$39>>0]|0;HEAP8[$30+1>>0]=HEAP8[$39+1>>0]|0;HEAP8[$30+2>>0]=HEAP8[$39+2>>0]|0;HEAP8[$30+3>>0]=HEAP8[$39+3>>0]|0;
 ;HEAP8[$31>>0]=HEAP8[$38>>0]|0;
 $25 = $200;
 $205 = $25;
 ;HEAP8[$22>>0]=HEAP8[$28>>0]|0;
 ;HEAP8[$23>>0]=HEAP8[$27>>0]|0;
 ;HEAP8[$24>>0]=HEAP8[$26>>0]|0;
 $19 = $205;
 $20 = $30;
 $21 = $29;
 $206 = $19;
 $207 = $20;
 $18 = $207;
 $208 = $18;
 $17 = $208;
 $209 = $17;
 $210 = HEAP32[$209>>2]|0;
 $14 = $210;
 $211 = $14;
 $212 = HEAP32[$211>>2]|0;
 HEAP32[$206>>2] = $212;
 $213 = ((($206)) + 4|0);
 $15 = $213;
 $214 = $15;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEEC2ERKS2_($214,$16);
 $7 = $0;
 $215 = $7;
 $6 = $215;
 $216 = $6;
 $217 = ((($216)) + 4|0);
 $5 = $217;
 $218 = $5;
 $219 = ((($218)) + 4|0);
 HEAP8[$219>>0] = 1;
 $$expand_i1_val2 = 1;
 HEAP8[$126>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$126>>0]|0;
 $220 = $$pre_trunc&1;
 if ($220) {
  STACKTOP = sp;return;
 }
 $117 = $0;
 $221 = $117;
 $114 = $221;
 $115 = 0;
 $222 = $114;
 $113 = $222;
 $223 = $113;
 $112 = $223;
 $224 = $112;
 $225 = HEAP32[$224>>2]|0;
 $116 = $225;
 $226 = $115;
 $94 = $222;
 $227 = $94;
 $93 = $227;
 $228 = $93;
 HEAP32[$228>>2] = $226;
 $229 = $116;
 $230 = ($229|0)!=(0|0);
 if (!($230)) {
  STACKTOP = sp;return;
 }
 $92 = $222;
 $231 = $92;
 $232 = ((($231)) + 4|0);
 $91 = $232;
 $233 = $91;
 $234 = $116;
 $110 = $233;
 $111 = $234;
 $235 = $110;
 $236 = ((($235)) + 4|0);
 $237 = HEAP8[$236>>0]|0;
 $238 = $237&1;
 if ($238) {
  $239 = HEAP32[$235>>2]|0;
  $240 = $111;
  $241 = ((($240)) + 16|0);
  $109 = $241;
  $242 = $109;
  $108 = $242;
  $243 = $108;
  $105 = $239;
  $106 = $243;
  $244 = $105;
  $245 = $106;
  ;HEAP8[$104>>0]=HEAP8[$107>>0]|0;
  $102 = $244;
  $103 = $245;
  $246 = $103;
  __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($246);
 }
 $247 = $111;
 $248 = ($247|0)!=(0|0);
 if (!($248)) {
  STACKTOP = sp;return;
 }
 $249 = HEAP32[$235>>2]|0;
 $250 = $111;
 $99 = $249;
 $100 = $250;
 $101 = 1;
 $251 = $99;
 $252 = $100;
 $253 = $101;
 $96 = $251;
 $97 = $252;
 $98 = $253;
 $254 = $97;
 $95 = $254;
 $255 = $95;
 __ZdlPv($255);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSI_SI_($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $15 = $0;
 $16 = $1;
 $17 = $2;
 $18 = $3;
 $19 = $15;
 $20 = $18;
 HEAP32[$20>>2] = 0;
 $21 = $18;
 $22 = ((($21)) + 4|0);
 HEAP32[$22>>2] = 0;
 $23 = $16;
 $24 = $18;
 $25 = ((($24)) + 8|0);
 HEAP32[$25>>2] = $23;
 $26 = $18;
 $27 = $17;
 HEAP32[$27>>2] = $26;
 $14 = $19;
 $28 = $14;
 $29 = HEAP32[$28>>2]|0;
 $30 = HEAP32[$29>>2]|0;
 $31 = ($30|0)!=(0|0);
 if ($31) {
  $10 = $19;
  $32 = $10;
  $33 = HEAP32[$32>>2]|0;
  $34 = HEAP32[$33>>2]|0;
  $4 = $19;
  $35 = $4;
  HEAP32[$35>>2] = $34;
 }
 $9 = $19;
 $36 = $9;
 $37 = ((($36)) + 4|0);
 $8 = $37;
 $38 = $8;
 $7 = $38;
 $39 = $7;
 $6 = $39;
 $40 = $6;
 $5 = $40;
 $41 = $5;
 $42 = HEAP32[$41>>2]|0;
 $43 = $17;
 $44 = HEAP32[$43>>2]|0;
 __ZNSt3__227__tree_balance_after_insertIPNS_16__tree_node_baseIPvEEEEvT_S5_($42,$44);
 $13 = $19;
 $45 = $13;
 $46 = ((($45)) + 8|0);
 $12 = $46;
 $47 = $12;
 $11 = $47;
 $48 = $11;
 $49 = HEAP32[$48>>2]|0;
 $50 = (($49) + 1)|0;
 HEAP32[$48>>2] = $50;
 STACKTOP = sp;return;
}
function __ZNKSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE10__root_ptrEv($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = $0;
 $8 = $7;
 $6 = $8;
 $9 = $6;
 $10 = ((($9)) + 4|0);
 $5 = $10;
 $11 = $5;
 $4 = $11;
 $12 = $4;
 $3 = $12;
 $13 = $3;
 $2 = $13;
 $14 = $2;
 $1 = $14;
 $15 = $1;
 STACKTOP = sp;return ($15|0);
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEEC2ERKS2_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 112|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(112|0);
 $26 = sp;
 $24 = $0;
 $25 = $1;
 $27 = $24;
 $28 = ((($27)) + 4|0);
 $23 = $28;
 $29 = $23;
 $22 = $29;
 $30 = $22;
 $21 = $30;
 $31 = $21;
 HEAP32[$31>>2] = 0;
 $20 = $29;
 $32 = $20;
 $19 = $32;
 $33 = ((($27)) + 8|0);
 HEAP32[$26>>2] = 0;
 $34 = $25;
 $16 = $33;
 $17 = $26;
 $18 = $34;
 $35 = $16;
 $36 = $17;
 $15 = $36;
 $37 = $15;
 $9 = $35;
 $10 = $37;
 $38 = $9;
 $39 = $10;
 $8 = $39;
 $40 = $8;
 $41 = HEAP32[$40>>2]|0;
 HEAP32[$38>>2] = $41;
 $42 = $18;
 $11 = $42;
 $43 = $11;
 $13 = $35;
 $14 = $43;
 $44 = $14;
 $12 = $44;
 $6 = $27;
 $45 = $6;
 $46 = ((($45)) + 4|0);
 $5 = $46;
 $47 = $5;
 $4 = $47;
 $48 = $4;
 $3 = $48;
 $49 = $3;
 $2 = $49;
 $50 = $2;
 $7 = $27;
 $51 = $7;
 HEAP32[$51>>2] = $50;
 STACKTOP = sp;return;
}
function __ZNSt3__227__tree_balance_after_insertIPNS_16__tree_node_baseIPvEEEEvT_S5_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0;
 var $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0;
 var $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $20 = $0;
 $21 = $1;
 $24 = $21;
 $25 = $20;
 $26 = ($24|0)==($25|0);
 $27 = $21;
 $28 = ((($27)) + 12|0);
 $29 = $26&1;
 HEAP8[$28>>0] = $29;
 while(1) {
  $30 = $21;
  $31 = $20;
  $32 = ($30|0)!=($31|0);
  if (!($32)) {
   label = 18;
   break;
  }
  $33 = $21;
  $19 = $33;
  $34 = $19;
  $35 = ((($34)) + 8|0);
  $36 = HEAP32[$35>>2]|0;
  $37 = ((($36)) + 12|0);
  $38 = HEAP8[$37>>0]|0;
  $39 = $38&1;
  $40 = $39 ^ 1;
  if (!($40)) {
   label = 18;
   break;
  }
  $41 = $21;
  $18 = $41;
  $42 = $18;
  $43 = ((($42)) + 8|0);
  $44 = HEAP32[$43>>2]|0;
  $17 = $44;
  $45 = $17;
  $46 = $17;
  $47 = ((($46)) + 8|0);
  $48 = HEAP32[$47>>2]|0;
  $49 = HEAP32[$48>>2]|0;
  $50 = ($45|0)==($49|0);
  $51 = $21;
  if ($50) {
   $14 = $51;
   $52 = $14;
   $53 = ((($52)) + 8|0);
   $54 = HEAP32[$53>>2]|0;
   $8 = $54;
   $55 = $8;
   $56 = ((($55)) + 8|0);
   $57 = HEAP32[$56>>2]|0;
   $58 = ((($57)) + 4|0);
   $59 = HEAP32[$58>>2]|0;
   $22 = $59;
   $60 = $22;
   $61 = ($60|0)!=(0|0);
   if (!($61)) {
    label = 8;
    break;
   }
   $62 = $22;
   $63 = ((($62)) + 12|0);
   $64 = HEAP8[$63>>0]|0;
   $65 = $64&1;
   if ($65) {
    label = 8;
    break;
   }
   $66 = $21;
   $5 = $66;
   $67 = $5;
   $68 = ((($67)) + 8|0);
   $69 = HEAP32[$68>>2]|0;
   $21 = $69;
   $70 = $21;
   $71 = ((($70)) + 12|0);
   HEAP8[$71>>0] = 1;
   $72 = $21;
   $2 = $72;
   $73 = $2;
   $74 = ((($73)) + 8|0);
   $75 = HEAP32[$74>>2]|0;
   $21 = $75;
   $76 = $21;
   $77 = $20;
   $78 = ($76|0)==($77|0);
   $79 = $21;
   $80 = ((($79)) + 12|0);
   $81 = $78&1;
   HEAP8[$80>>0] = $81;
   $82 = $22;
   $83 = ((($82)) + 12|0);
   HEAP8[$83>>0] = 1;
  } else {
   $9 = $51;
   $109 = $9;
   $110 = ((($109)) + 8|0);
   $111 = HEAP32[$110>>2]|0;
   $112 = ((($111)) + 8|0);
   $113 = HEAP32[$112>>2]|0;
   $114 = HEAP32[$113>>2]|0;
   $23 = $114;
   $115 = $23;
   $116 = ($115|0)!=(0|0);
   if (!($116)) {
    label = 14;
    break;
   }
   $117 = $23;
   $118 = ((($117)) + 12|0);
   $119 = HEAP8[$118>>0]|0;
   $120 = $119&1;
   if ($120) {
    label = 14;
    break;
   }
   $121 = $21;
   $10 = $121;
   $122 = $10;
   $123 = ((($122)) + 8|0);
   $124 = HEAP32[$123>>2]|0;
   $21 = $124;
   $125 = $21;
   $126 = ((($125)) + 12|0);
   HEAP8[$126>>0] = 1;
   $127 = $21;
   $11 = $127;
   $128 = $11;
   $129 = ((($128)) + 8|0);
   $130 = HEAP32[$129>>2]|0;
   $21 = $130;
   $131 = $21;
   $132 = $20;
   $133 = ($131|0)==($132|0);
   $134 = $21;
   $135 = ((($134)) + 12|0);
   $136 = $133&1;
   HEAP8[$135>>0] = $136;
   $137 = $23;
   $138 = ((($137)) + 12|0);
   HEAP8[$138>>0] = 1;
  }
 }
 if ((label|0) == 8) {
  $84 = $21;
  $3 = $84;
  $85 = $3;
  $86 = $3;
  $87 = ((($86)) + 8|0);
  $88 = HEAP32[$87>>2]|0;
  $89 = HEAP32[$88>>2]|0;
  $90 = ($85|0)==($89|0);
  if (!($90)) {
   $91 = $21;
   $4 = $91;
   $92 = $4;
   $93 = ((($92)) + 8|0);
   $94 = HEAP32[$93>>2]|0;
   $21 = $94;
   $95 = $21;
   __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($95);
  }
  $96 = $21;
  $6 = $96;
  $97 = $6;
  $98 = ((($97)) + 8|0);
  $99 = HEAP32[$98>>2]|0;
  $21 = $99;
  $100 = $21;
  $101 = ((($100)) + 12|0);
  HEAP8[$101>>0] = 1;
  $102 = $21;
  $7 = $102;
  $103 = $7;
  $104 = ((($103)) + 8|0);
  $105 = HEAP32[$104>>2]|0;
  $21 = $105;
  $106 = $21;
  $107 = ((($106)) + 12|0);
  HEAP8[$107>>0] = 0;
  $108 = $21;
  __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($108);
  STACKTOP = sp;return;
 }
 else if ((label|0) == 14) {
  $139 = $21;
  $12 = $139;
  $140 = $12;
  $141 = $12;
  $142 = ((($141)) + 8|0);
  $143 = HEAP32[$142>>2]|0;
  $144 = HEAP32[$143>>2]|0;
  $145 = ($140|0)==($144|0);
  if ($145) {
   $146 = $21;
   $13 = $146;
   $147 = $13;
   $148 = ((($147)) + 8|0);
   $149 = HEAP32[$148>>2]|0;
   $21 = $149;
   $150 = $21;
   __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($150);
  }
  $151 = $21;
  $15 = $151;
  $152 = $15;
  $153 = ((($152)) + 8|0);
  $154 = HEAP32[$153>>2]|0;
  $21 = $154;
  $155 = $21;
  $156 = ((($155)) + 12|0);
  HEAP8[$156>>0] = 1;
  $157 = $21;
  $16 = $157;
  $158 = $16;
  $159 = ((($158)) + 8|0);
  $160 = HEAP32[$159>>2]|0;
  $21 = $160;
  $161 = $21;
  $162 = ((($161)) + 12|0);
  HEAP8[$162>>0] = 0;
  $163 = $21;
  __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($163);
  STACKTOP = sp;return;
 }
 else if ((label|0) == 18) {
  STACKTOP = sp;return;
 }
}
function __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = $0;
 $9 = $7;
 $10 = ((($9)) + 4|0);
 $11 = HEAP32[$10>>2]|0;
 $8 = $11;
 $12 = $8;
 $13 = HEAP32[$12>>2]|0;
 $14 = $7;
 $15 = ((($14)) + 4|0);
 HEAP32[$15>>2] = $13;
 $16 = $7;
 $17 = ((($16)) + 4|0);
 $18 = HEAP32[$17>>2]|0;
 $19 = ($18|0)!=(0|0);
 if ($19) {
  $20 = $7;
  $21 = ((($20)) + 4|0);
  $22 = HEAP32[$21>>2]|0;
  $23 = $7;
  $5 = $22;
  $6 = $23;
  $24 = $5;
  $25 = $6;
  $26 = ((($24)) + 8|0);
  HEAP32[$26>>2] = $25;
 }
 $27 = $7;
 $28 = ((($27)) + 8|0);
 $29 = HEAP32[$28>>2]|0;
 $30 = $8;
 $31 = ((($30)) + 8|0);
 HEAP32[$31>>2] = $29;
 $32 = $7;
 $4 = $32;
 $33 = $4;
 $34 = $4;
 $35 = ((($34)) + 8|0);
 $36 = HEAP32[$35>>2]|0;
 $37 = HEAP32[$36>>2]|0;
 $38 = ($33|0)==($37|0);
 $39 = $8;
 $40 = $7;
 if ($38) {
  $41 = ((($40)) + 8|0);
  $42 = HEAP32[$41>>2]|0;
  HEAP32[$42>>2] = $39;
  $47 = $7;
  $48 = $8;
  HEAP32[$48>>2] = $47;
  $49 = $7;
  $50 = $8;
  $2 = $49;
  $3 = $50;
  $51 = $2;
  $52 = $3;
  $53 = ((($51)) + 8|0);
  HEAP32[$53>>2] = $52;
  STACKTOP = sp;return;
 } else {
  $1 = $40;
  $43 = $1;
  $44 = ((($43)) + 8|0);
  $45 = HEAP32[$44>>2]|0;
  $46 = ((($45)) + 4|0);
  HEAP32[$46>>2] = $39;
  $47 = $7;
  $48 = $8;
  HEAP32[$48>>2] = $47;
  $49 = $7;
  $50 = $8;
  $2 = $49;
  $3 = $50;
  $51 = $2;
  $52 = $3;
  $53 = ((($51)) + 8|0);
  HEAP32[$53>>2] = $52;
  STACKTOP = sp;return;
 }
}
function __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $7 = $0;
 $9 = $7;
 $10 = HEAP32[$9>>2]|0;
 $8 = $10;
 $11 = $8;
 $12 = ((($11)) + 4|0);
 $13 = HEAP32[$12>>2]|0;
 $14 = $7;
 HEAP32[$14>>2] = $13;
 $15 = $7;
 $16 = HEAP32[$15>>2]|0;
 $17 = ($16|0)!=(0|0);
 if ($17) {
  $18 = $7;
  $19 = HEAP32[$18>>2]|0;
  $20 = $7;
  $5 = $19;
  $6 = $20;
  $21 = $5;
  $22 = $6;
  $23 = ((($21)) + 8|0);
  HEAP32[$23>>2] = $22;
 }
 $24 = $7;
 $25 = ((($24)) + 8|0);
 $26 = HEAP32[$25>>2]|0;
 $27 = $8;
 $28 = ((($27)) + 8|0);
 HEAP32[$28>>2] = $26;
 $29 = $7;
 $4 = $29;
 $30 = $4;
 $31 = $4;
 $32 = ((($31)) + 8|0);
 $33 = HEAP32[$32>>2]|0;
 $34 = HEAP32[$33>>2]|0;
 $35 = ($30|0)==($34|0);
 $36 = $8;
 $37 = $7;
 if ($35) {
  $38 = ((($37)) + 8|0);
  $39 = HEAP32[$38>>2]|0;
  HEAP32[$39>>2] = $36;
  $44 = $7;
  $45 = $8;
  $46 = ((($45)) + 4|0);
  HEAP32[$46>>2] = $44;
  $47 = $7;
  $48 = $8;
  $2 = $47;
  $3 = $48;
  $49 = $2;
  $50 = $3;
  $51 = ((($49)) + 8|0);
  HEAP32[$51>>2] = $50;
  STACKTOP = sp;return;
 } else {
  $1 = $37;
  $40 = $1;
  $41 = ((($40)) + 8|0);
  $42 = HEAP32[$41>>2]|0;
  $43 = ((($42)) + 4|0);
  HEAP32[$43>>2] = $36;
  $44 = $7;
  $45 = $8;
  $46 = ((($45)) + 4|0);
  HEAP32[$46>>2] = $44;
  $47 = $7;
  $48 = $8;
  $2 = $47;
  $3 = $48;
  $49 = $2;
  $50 = $3;
  $51 = ((($49)) + 8|0);
  HEAP32[$51>>2] = $50;
  STACKTOP = sp;return;
 }
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__emplace_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEEDpOT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0;
 var $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0;
 var $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0;
 var $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0;
 var $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0;
 var $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 208|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(208|0);
 $27 = sp;
 $30 = sp + 200|0;
 $45 = sp + 32|0;
 $48 = sp + 12|0;
 $49 = sp + 8|0;
 $46 = $0;
 $47 = $1;
 $51 = $46;
 $52 = $47;
 $44 = $52;
 $53 = $44;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__construct_nodeIJRKcEEENS_10unique_ptrINS_11__tree_nodeIcPvEENS_22__tree_node_destructorINS3_ISC_EEEEEEDpOT_($48,$51,$53);
 $43 = $48;
 $54 = $43;
 $42 = $54;
 $55 = $42;
 $41 = $55;
 $56 = $41;
 $57 = HEAP32[$56>>2]|0;
 $58 = ((($57)) + 13|0);
 $13 = $58;
 $59 = $13;
 $60 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__find_leaf_highERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERKc($51,$49,$59)|0);
 $50 = $60;
 $61 = HEAP32[$49>>2]|0;
 $62 = $50;
 $4 = $48;
 $63 = $4;
 $3 = $63;
 $64 = $3;
 $2 = $64;
 $65 = $2;
 $66 = HEAP32[$65>>2]|0;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSA_SA_($51,$61,$62,$66);
 $9 = $48;
 $67 = $9;
 $8 = $67;
 $68 = $8;
 $7 = $68;
 $69 = $7;
 $70 = HEAP32[$69>>2]|0;
 $10 = $70;
 $6 = $67;
 $71 = $6;
 $5 = $71;
 $72 = $5;
 HEAP32[$72>>2] = 0;
 $73 = $10;
 $11 = $45;
 $12 = $73;
 $74 = $11;
 $75 = $12;
 HEAP32[$74>>2] = $75;
 $40 = $48;
 $76 = $40;
 $37 = $76;
 $38 = 0;
 $77 = $37;
 $36 = $77;
 $78 = $36;
 $35 = $78;
 $79 = $35;
 $80 = HEAP32[$79>>2]|0;
 $39 = $80;
 $81 = $38;
 $17 = $77;
 $82 = $17;
 $16 = $82;
 $83 = $16;
 HEAP32[$83>>2] = $81;
 $84 = $39;
 $85 = ($84|0)!=(0|0);
 if (!($85)) {
  $110 = HEAP32[$45>>2]|0;
  STACKTOP = sp;return ($110|0);
 }
 $15 = $77;
 $86 = $15;
 $87 = ((($86)) + 4|0);
 $14 = $87;
 $88 = $14;
 $89 = $39;
 $33 = $88;
 $34 = $89;
 $90 = $33;
 $91 = ((($90)) + 4|0);
 $92 = HEAP8[$91>>0]|0;
 $93 = $92&1;
 if ($93) {
  $94 = HEAP32[$90>>2]|0;
  $95 = $34;
  $96 = ((($95)) + 13|0);
  $32 = $96;
  $97 = $32;
  $31 = $97;
  $98 = $31;
  $28 = $94;
  $29 = $98;
  $99 = $28;
  $100 = $29;
  ;HEAP8[$27>>0]=HEAP8[$30>>0]|0;
  $25 = $99;
  $26 = $100;
 }
 $101 = $34;
 $102 = ($101|0)!=(0|0);
 if (!($102)) {
  $110 = HEAP32[$45>>2]|0;
  STACKTOP = sp;return ($110|0);
 }
 $103 = HEAP32[$90>>2]|0;
 $104 = $34;
 $22 = $103;
 $23 = $104;
 $24 = 1;
 $105 = $22;
 $106 = $23;
 $107 = $24;
 $19 = $105;
 $20 = $106;
 $21 = $107;
 $108 = $20;
 $18 = $108;
 $109 = $18;
 __ZdlPv($109);
 $110 = HEAP32[$45>>2]|0;
 STACKTOP = sp;return ($110|0);
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__construct_nodeIJRKcEEENS_10unique_ptrINS_11__tree_nodeIcPvEENS_22__tree_node_destructorINS3_ISC_EEEEEEDpOT_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0;
 var $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0;
 var $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0;
 var $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0;
 var $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0;
 var $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 352|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(352|0);
 $14 = sp + 8|0;
 $19 = sp + 343|0;
 $39 = sp + 200|0;
 $67 = sp;
 $70 = sp + 341|0;
 $87 = sp + 340|0;
 $88 = sp + 16|0;
 $84 = $1;
 $85 = $2;
 $89 = $84;
 $83 = $89;
 $90 = $83;
 $91 = ((($90)) + 4|0);
 $82 = $91;
 $92 = $82;
 $81 = $92;
 $93 = $81;
 $86 = $93;
 $$expand_i1_val = 0;
 HEAP8[$87>>0] = $$expand_i1_val;
 $94 = $86;
 $52 = $94;
 $53 = 1;
 $95 = $52;
 $96 = $53;
 $49 = $95;
 $50 = $96;
 $51 = 0;
 $97 = $49;
 $98 = $50;
 $48 = $97;
 $99 = ($98>>>0)>(268435455);
 if ($99) {
  $46 = 3928;
  $100 = (___cxa_allocate_exception(8)|0);
  $101 = $46;
  $44 = $100;
  $45 = $101;
  $102 = $44;
  $103 = $45;
  __ZNSt11logic_errorC2EPKc($102,$103);
  HEAP32[$102>>2] = (3644);
  ___cxa_throw(($100|0),(2792|0),(18|0));
  // unreachable;
 }
 $104 = $50;
 $105 = $104<<4;
 $47 = $105;
 $106 = $47;
 $107 = (__Znwm($106)|0);
 $108 = $86;
 $41 = $88;
 $42 = $108;
 $43 = 0;
 $109 = $41;
 $110 = $42;
 HEAP32[$109>>2] = $110;
 $111 = ((($109)) + 4|0);
 $112 = $43;
 $113 = $112&1;
 $114 = $113&1;
 HEAP8[$111>>0] = $114;
 $38 = $0;
 HEAP32[$39>>2] = $107;
 $40 = $88;
 $115 = $38;
 $116 = $40;
 $37 = $116;
 $117 = $37;
 $34 = $115;
 $35 = $39;
 $36 = $117;
 $118 = $34;
 $119 = $35;
 $33 = $119;
 $120 = $33;
 $27 = $118;
 $28 = $120;
 $121 = $27;
 $122 = $28;
 $26 = $122;
 $123 = $26;
 $124 = HEAP32[$123>>2]|0;
 HEAP32[$121>>2] = $124;
 $125 = ((($118)) + 4|0);
 $126 = $36;
 $29 = $126;
 $127 = $29;
 $31 = $125;
 $32 = $127;
 $128 = $31;
 $129 = $32;
 $30 = $129;
 $130 = $30;
 ;HEAP32[$128>>2]=HEAP32[$130>>2]|0;HEAP32[$128+4>>2]=HEAP32[$130+4>>2]|0;
 $131 = $86;
 $25 = $0;
 $132 = $25;
 $24 = $132;
 $133 = $24;
 $23 = $133;
 $134 = $23;
 $135 = HEAP32[$134>>2]|0;
 $136 = ((($135)) + 13|0);
 $22 = $136;
 $137 = $22;
 $21 = $137;
 $138 = $21;
 $139 = $85;
 $20 = $139;
 $140 = $20;
 $16 = $131;
 $17 = $138;
 $18 = $140;
 $141 = $16;
 $142 = $17;
 $143 = $18;
 $15 = $143;
 $144 = $15;
 ;HEAP8[$14>>0]=HEAP8[$19>>0]|0;
 $11 = $141;
 $12 = $142;
 $13 = $144;
 $145 = $11;
 $146 = $12;
 $147 = $13;
 $10 = $147;
 $148 = $10;
 $7 = $145;
 $8 = $146;
 $9 = $148;
 $149 = $8;
 $150 = $9;
 $6 = $150;
 $151 = $6;
 $152 = HEAP8[$151>>0]|0;
 HEAP8[$149>>0] = $152;
 $5 = $0;
 $153 = $5;
 $4 = $153;
 $154 = $4;
 $155 = ((($154)) + 4|0);
 $3 = $155;
 $156 = $3;
 $157 = ((($156)) + 4|0);
 HEAP8[$157>>0] = 1;
 $$expand_i1_val2 = 1;
 HEAP8[$87>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$87>>0]|0;
 $158 = $$pre_trunc&1;
 if ($158) {
  STACKTOP = sp;return;
 }
 $80 = $0;
 $159 = $80;
 $77 = $159;
 $78 = 0;
 $160 = $77;
 $76 = $160;
 $161 = $76;
 $75 = $161;
 $162 = $75;
 $163 = HEAP32[$162>>2]|0;
 $79 = $163;
 $164 = $78;
 $57 = $160;
 $165 = $57;
 $56 = $165;
 $166 = $56;
 HEAP32[$166>>2] = $164;
 $167 = $79;
 $168 = ($167|0)!=(0|0);
 if (!($168)) {
  STACKTOP = sp;return;
 }
 $55 = $160;
 $169 = $55;
 $170 = ((($169)) + 4|0);
 $54 = $170;
 $171 = $54;
 $172 = $79;
 $73 = $171;
 $74 = $172;
 $173 = $73;
 $174 = ((($173)) + 4|0);
 $175 = HEAP8[$174>>0]|0;
 $176 = $175&1;
 if ($176) {
  $177 = HEAP32[$173>>2]|0;
  $178 = $74;
  $179 = ((($178)) + 13|0);
  $72 = $179;
  $180 = $72;
  $71 = $180;
  $181 = $71;
  $68 = $177;
  $69 = $181;
  $182 = $68;
  $183 = $69;
  ;HEAP8[$67>>0]=HEAP8[$70>>0]|0;
  $65 = $182;
  $66 = $183;
 }
 $184 = $74;
 $185 = ($184|0)!=(0|0);
 if (!($185)) {
  STACKTOP = sp;return;
 }
 $186 = HEAP32[$173>>2]|0;
 $187 = $74;
 $62 = $186;
 $63 = $187;
 $64 = 1;
 $188 = $62;
 $189 = $63;
 $190 = $64;
 $59 = $188;
 $60 = $189;
 $61 = $190;
 $191 = $60;
 $58 = $191;
 $192 = $58;
 __ZdlPv($192);
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__find_leaf_highERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERKc($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $21 = $0;
 $22 = $1;
 $23 = $2;
 $25 = $21;
 $19 = $25;
 $26 = $19;
 $18 = $26;
 $27 = $18;
 $28 = ((($27)) + 4|0);
 $17 = $28;
 $29 = $17;
 $16 = $29;
 $30 = $16;
 $15 = $30;
 $31 = $15;
 $14 = $31;
 $32 = $14;
 $33 = HEAP32[$32>>2]|0;
 $24 = $33;
 $34 = $24;
 $35 = ($34|0)!=(0|0);
 if (!($35)) {
  $13 = $25;
  $67 = $13;
  $68 = ((($67)) + 4|0);
  $12 = $68;
  $69 = $12;
  $11 = $69;
  $70 = $11;
  $10 = $70;
  $71 = $10;
  $9 = $71;
  $72 = $9;
  $73 = $22;
  HEAP32[$73>>2] = $72;
  $74 = $22;
  $75 = HEAP32[$74>>2]|0;
  $20 = $75;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 while(1) {
  $5 = $25;
  $36 = $5;
  $37 = ((($36)) + 8|0);
  $4 = $37;
  $38 = $4;
  $3 = $38;
  $39 = $3;
  $40 = $23;
  $41 = $24;
  $42 = ((($41)) + 13|0);
  $6 = $39;
  $7 = $40;
  $8 = $42;
  $43 = $7;
  $44 = HEAP8[$43>>0]|0;
  $45 = $44 << 24 >> 24;
  $46 = $8;
  $47 = HEAP8[$46>>0]|0;
  $48 = $47 << 24 >> 24;
  $49 = ($45|0)<($48|0);
  $50 = $24;
  if ($49) {
   $51 = HEAP32[$50>>2]|0;
   $52 = ($51|0)!=(0|0);
   $53 = $24;
   if (!($52)) {
    label = 6;
    break;
   }
   $54 = HEAP32[$53>>2]|0;
   $24 = $54;
  } else {
   $58 = ((($50)) + 4|0);
   $59 = HEAP32[$58>>2]|0;
   $60 = ($59|0)!=(0|0);
   $61 = $24;
   if (!($60)) {
    label = 9;
    break;
   }
   $62 = ((($61)) + 4|0);
   $63 = HEAP32[$62>>2]|0;
   $24 = $63;
  }
 }
 if ((label|0) == 6) {
  $55 = $22;
  HEAP32[$55>>2] = $53;
  $56 = $22;
  $57 = HEAP32[$56>>2]|0;
  $20 = $57;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 else if ((label|0) == 9) {
  $64 = $22;
  HEAP32[$64>>2] = $61;
  $65 = $24;
  $66 = ((($65)) + 4|0);
  $20 = $66;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 return (0)|0;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSA_SA_($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $15 = $0;
 $16 = $1;
 $17 = $2;
 $18 = $3;
 $19 = $15;
 $20 = $18;
 HEAP32[$20>>2] = 0;
 $21 = $18;
 $22 = ((($21)) + 4|0);
 HEAP32[$22>>2] = 0;
 $23 = $16;
 $24 = $18;
 $25 = ((($24)) + 8|0);
 HEAP32[$25>>2] = $23;
 $26 = $18;
 $27 = $17;
 HEAP32[$27>>2] = $26;
 $14 = $19;
 $28 = $14;
 $29 = HEAP32[$28>>2]|0;
 $30 = HEAP32[$29>>2]|0;
 $31 = ($30|0)!=(0|0);
 if ($31) {
  $10 = $19;
  $32 = $10;
  $33 = HEAP32[$32>>2]|0;
  $34 = HEAP32[$33>>2]|0;
  $4 = $19;
  $35 = $4;
  HEAP32[$35>>2] = $34;
 }
 $9 = $19;
 $36 = $9;
 $37 = ((($36)) + 4|0);
 $8 = $37;
 $38 = $8;
 $7 = $38;
 $39 = $7;
 $6 = $39;
 $40 = $6;
 $5 = $40;
 $41 = $5;
 $42 = HEAP32[$41>>2]|0;
 $43 = $17;
 $44 = HEAP32[$43>>2]|0;
 __ZNSt3__227__tree_balance_after_insertIPNS_16__tree_node_baseIPvEEEEvT_S5_($42,$44);
 $13 = $19;
 $45 = $13;
 $46 = ((($45)) + 8|0);
 $12 = $46;
 $47 = $12;
 $11 = $47;
 $48 = $11;
 $49 = HEAP32[$48>>2]|0;
 $50 = (($49) + 1)|0;
 HEAP32[$48>>2] = $50;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE5clearEv($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $21 = $0;
 $22 = $21;
 $20 = $22;
 $23 = $20;
 $19 = $23;
 $24 = $19;
 $25 = ((($24)) + 4|0);
 $18 = $25;
 $26 = $18;
 $17 = $26;
 $27 = $17;
 $16 = $27;
 $28 = $16;
 $15 = $28;
 $29 = $15;
 $30 = HEAP32[$29>>2]|0;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE7destroyEPNS_11__tree_nodeIS8_PvEE($22,$30);
 $3 = $22;
 $31 = $3;
 $32 = ((($31)) + 8|0);
 $2 = $32;
 $33 = $2;
 $1 = $33;
 $34 = $1;
 HEAP32[$34>>2] = 0;
 $8 = $22;
 $35 = $8;
 $36 = ((($35)) + 4|0);
 $7 = $36;
 $37 = $7;
 $6 = $37;
 $38 = $6;
 $5 = $38;
 $39 = $5;
 $4 = $39;
 $40 = $4;
 $9 = $22;
 $41 = $9;
 HEAP32[$41>>2] = $40;
 $14 = $22;
 $42 = $14;
 $43 = ((($42)) + 4|0);
 $13 = $43;
 $44 = $13;
 $12 = $44;
 $45 = $12;
 $11 = $45;
 $46 = $11;
 $10 = $46;
 $47 = $10;
 HEAP32[$47>>2] = 0;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE25__emplace_unique_key_argsIiJRKNS_21piecewise_construct_tENS_5tupleIJOiEEENSI_IJEEEEEENS_4pairINS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEEbEERKT_DpOT0_($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0;
 var $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $50 = 0, $51 = 0, $52 = 0;
 var $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0;
 var $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0;
 var $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 240|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(240|0);
 $28 = sp;
 $31 = sp + 229|0;
 $57 = sp + 28|0;
 $60 = sp + 228|0;
 $61 = sp + 8|0;
 $62 = sp + 4|0;
 $52 = $1;
 $53 = $2;
 $54 = $3;
 $55 = $4;
 $56 = $5;
 $63 = $52;
 $64 = $53;
 $65 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEERPNS_15__tree_end_nodeISI_EERKT_($63,$57,$64)|0);
 $58 = $65;
 $66 = $58;
 $67 = HEAP32[$66>>2]|0;
 $59 = $67;
 HEAP8[$60>>0] = 0;
 $68 = $58;
 $69 = HEAP32[$68>>2]|0;
 $70 = ($69|0)==(0|0);
 if ($70) {
  $71 = $54;
  $51 = $71;
  $72 = $51;
  $73 = $55;
  $43 = $73;
  $74 = $43;
  $75 = $56;
  $42 = $75;
  $76 = $42;
  __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_21piecewise_construct_tENS_5tupleIJOiEEENSI_IJEEEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISP_EEEEEEDpOT_($61,$63,$72,$74,$76);
  $77 = HEAP32[$57>>2]|0;
  $78 = $58;
  $14 = $61;
  $79 = $14;
  $13 = $79;
  $80 = $13;
  $12 = $80;
  $81 = $12;
  $82 = HEAP32[$81>>2]|0;
  __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSI_SI_($63,$77,$78,$82);
  $10 = $61;
  $83 = $10;
  $9 = $83;
  $84 = $9;
  $8 = $84;
  $85 = $8;
  $86 = HEAP32[$85>>2]|0;
  $11 = $86;
  $7 = $83;
  $87 = $7;
  $6 = $87;
  $88 = $6;
  HEAP32[$88>>2] = 0;
  $89 = $11;
  $59 = $89;
  HEAP8[$60>>0] = 1;
  $41 = $61;
  $90 = $41;
  $38 = $90;
  $39 = 0;
  $91 = $38;
  $37 = $91;
  $92 = $37;
  $36 = $92;
  $93 = $36;
  $94 = HEAP32[$93>>2]|0;
  $40 = $94;
  $95 = $39;
  $18 = $91;
  $96 = $18;
  $17 = $96;
  $97 = $17;
  HEAP32[$97>>2] = $95;
  $98 = $40;
  $99 = ($98|0)!=(0|0);
  if ($99) {
   $16 = $91;
   $100 = $16;
   $101 = ((($100)) + 4|0);
   $15 = $101;
   $102 = $15;
   $103 = $40;
   $34 = $102;
   $35 = $103;
   $104 = $34;
   $105 = ((($104)) + 4|0);
   $106 = HEAP8[$105>>0]|0;
   $107 = $106&1;
   if ($107) {
    $108 = HEAP32[$104>>2]|0;
    $109 = $35;
    $110 = ((($109)) + 16|0);
    $33 = $110;
    $111 = $33;
    $32 = $111;
    $112 = $32;
    $29 = $108;
    $30 = $112;
    $113 = $29;
    $114 = $30;
    ;HEAP8[$28>>0]=HEAP8[$31>>0]|0;
    $26 = $113;
    $27 = $114;
    $115 = $27;
    __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($115);
   }
   $116 = $35;
   $117 = ($116|0)!=(0|0);
   if ($117) {
    $118 = HEAP32[$104>>2]|0;
    $119 = $35;
    $23 = $118;
    $24 = $119;
    $25 = 1;
    $120 = $23;
    $121 = $24;
    $122 = $25;
    $20 = $120;
    $21 = $121;
    $22 = $122;
    $123 = $21;
    $19 = $123;
    $124 = $19;
    __ZdlPv($124);
   }
  }
 }
 $125 = $59;
 $44 = $62;
 $45 = $125;
 $126 = $44;
 $127 = $45;
 HEAP32[$126>>2] = $127;
 $48 = $0;
 $49 = $62;
 $50 = $60;
 $128 = $48;
 $129 = $49;
 $47 = $129;
 $130 = $47;
 ;HEAP32[$128>>2]=HEAP32[$130>>2]|0;
 $131 = ((($128)) + 4|0);
 $132 = $50;
 $46 = $132;
 $133 = $46;
 $134 = HEAP8[$133>>0]|0;
 $135 = $134&1;
 $136 = $135&1;
 HEAP8[$131>>0] = $136;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_21piecewise_construct_tENS_5tupleIJOiEEENSI_IJEEEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISP_EEEEEEDpOT_($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0;
 var $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0;
 var $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0;
 var $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0;
 var $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0;
 var $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0;
 var $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0;
 var $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0;
 var $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 512|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(512|0);
 $16 = sp + 497|0;
 $22 = sp + 56|0;
 $23 = sp + 48|0;
 $24 = sp + 40|0;
 $26 = sp + 496|0;
 $27 = sp + 495|0;
 $28 = sp + 494|0;
 $29 = sp + 32|0;
 $30 = sp + 24|0;
 $31 = sp + 16|0;
 $38 = sp + 493|0;
 $39 = sp + 392|0;
 $40 = sp + 492|0;
 $47 = sp + 8|0;
 $54 = sp + 491|0;
 $76 = sp + 256|0;
 $104 = sp;
 $107 = sp + 489|0;
 $126 = sp + 488|0;
 $127 = sp + 64|0;
 $121 = $1;
 $122 = $2;
 $123 = $3;
 $124 = $4;
 $128 = $121;
 $120 = $128;
 $129 = $120;
 $130 = ((($129)) + 4|0);
 $119 = $130;
 $131 = $119;
 $118 = $131;
 $132 = $118;
 $125 = $132;
 $$expand_i1_val = 0;
 HEAP8[$126>>0] = $$expand_i1_val;
 $133 = $125;
 $89 = $133;
 $90 = 1;
 $134 = $89;
 $135 = $90;
 $86 = $134;
 $87 = $135;
 $88 = 0;
 $136 = $86;
 $137 = $87;
 $85 = $136;
 $138 = ($137>>>0)>(134217727);
 if ($138) {
  $83 = 3928;
  $139 = (___cxa_allocate_exception(8)|0);
  $140 = $83;
  $81 = $139;
  $82 = $140;
  $141 = $81;
  $142 = $82;
  __ZNSt11logic_errorC2EPKc($141,$142);
  HEAP32[$141>>2] = (3644);
  ___cxa_throw(($139|0),(2792|0),(18|0));
  // unreachable;
 }
 $143 = $87;
 $144 = $143<<5;
 $84 = $144;
 $145 = $84;
 $146 = (__Znwm($145)|0);
 $147 = $125;
 $78 = $127;
 $79 = $147;
 $80 = 0;
 $148 = $78;
 $149 = $79;
 HEAP32[$148>>2] = $149;
 $150 = ((($148)) + 4|0);
 $151 = $80;
 $152 = $151&1;
 $153 = $152&1;
 HEAP8[$150>>0] = $153;
 $75 = $0;
 HEAP32[$76>>2] = $146;
 $77 = $127;
 $154 = $75;
 $155 = $77;
 $74 = $155;
 $156 = $74;
 $71 = $154;
 $72 = $76;
 $73 = $156;
 $157 = $71;
 $158 = $72;
 $70 = $158;
 $159 = $70;
 $64 = $157;
 $65 = $159;
 $160 = $64;
 $161 = $65;
 $63 = $161;
 $162 = $63;
 $163 = HEAP32[$162>>2]|0;
 HEAP32[$160>>2] = $163;
 $164 = ((($157)) + 4|0);
 $165 = $73;
 $66 = $165;
 $166 = $66;
 $68 = $164;
 $69 = $166;
 $167 = $68;
 $168 = $69;
 $67 = $168;
 $169 = $67;
 ;HEAP32[$167>>2]=HEAP32[$169>>2]|0;HEAP32[$167+4>>2]=HEAP32[$169+4>>2]|0;
 $170 = $125;
 $62 = $0;
 $171 = $62;
 $61 = $171;
 $172 = $61;
 $60 = $172;
 $173 = $60;
 $174 = HEAP32[$173>>2]|0;
 $175 = ((($174)) + 16|0);
 $59 = $175;
 $176 = $59;
 $58 = $176;
 $177 = $58;
 $178 = $122;
 $57 = $178;
 $179 = $57;
 $180 = $123;
 $56 = $180;
 $181 = $56;
 $182 = $124;
 $55 = $182;
 $183 = $55;
 $49 = $170;
 $50 = $177;
 $51 = $179;
 $52 = $181;
 $53 = $183;
 $184 = $49;
 $185 = $50;
 $186 = $51;
 $48 = $186;
 $187 = $48;
 $188 = $52;
 $9 = $188;
 $189 = $9;
 $190 = $53;
 $8 = $190;
 $191 = $8;
 ;HEAP8[$47>>0]=HEAP8[$54>>0]|0;
 $42 = $184;
 $43 = $185;
 $44 = $187;
 $45 = $189;
 $46 = $191;
 $192 = $42;
 $193 = $43;
 $194 = $44;
 $41 = $194;
 $195 = $41;
 $196 = $45;
 $11 = $196;
 $197 = $11;
 $198 = $46;
 $10 = $198;
 $199 = $10;
 $33 = $192;
 $34 = $193;
 $35 = $195;
 $36 = $197;
 $37 = $199;
 $200 = $34;
 $201 = $35;
 $32 = $201;
 $202 = $36;
 $13 = $202;
 $203 = $13;
 ;HEAP32[$39>>2]=HEAP32[$203>>2]|0;
 $204 = $37;
 $12 = $204;
 ;HEAP8[$29>>0]=HEAP8[$40>>0]|0;
 ;HEAP8[$30>>0]=HEAP8[$39>>0]|0;HEAP8[$30+1>>0]=HEAP8[$39+1>>0]|0;HEAP8[$30+2>>0]=HEAP8[$39+2>>0]|0;HEAP8[$30+3>>0]=HEAP8[$39+3>>0]|0;
 ;HEAP8[$31>>0]=HEAP8[$38>>0]|0;
 $25 = $200;
 $205 = $25;
 ;HEAP8[$22>>0]=HEAP8[$28>>0]|0;
 ;HEAP8[$23>>0]=HEAP8[$27>>0]|0;
 ;HEAP8[$24>>0]=HEAP8[$26>>0]|0;
 $19 = $205;
 $20 = $30;
 $21 = $29;
 $206 = $19;
 $207 = $20;
 $18 = $207;
 $208 = $18;
 $17 = $208;
 $209 = $17;
 $210 = HEAP32[$209>>2]|0;
 $14 = $210;
 $211 = $14;
 $212 = HEAP32[$211>>2]|0;
 HEAP32[$206>>2] = $212;
 $213 = ((($206)) + 4|0);
 $15 = $213;
 $214 = $15;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEEC2ERKS2_($214,$16);
 $7 = $0;
 $215 = $7;
 $6 = $215;
 $216 = $6;
 $217 = ((($216)) + 4|0);
 $5 = $217;
 $218 = $5;
 $219 = ((($218)) + 4|0);
 HEAP8[$219>>0] = 1;
 $$expand_i1_val2 = 1;
 HEAP8[$126>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$126>>0]|0;
 $220 = $$pre_trunc&1;
 if ($220) {
  STACKTOP = sp;return;
 }
 $117 = $0;
 $221 = $117;
 $114 = $221;
 $115 = 0;
 $222 = $114;
 $113 = $222;
 $223 = $113;
 $112 = $223;
 $224 = $112;
 $225 = HEAP32[$224>>2]|0;
 $116 = $225;
 $226 = $115;
 $94 = $222;
 $227 = $94;
 $93 = $227;
 $228 = $93;
 HEAP32[$228>>2] = $226;
 $229 = $116;
 $230 = ($229|0)!=(0|0);
 if (!($230)) {
  STACKTOP = sp;return;
 }
 $92 = $222;
 $231 = $92;
 $232 = ((($231)) + 4|0);
 $91 = $232;
 $233 = $91;
 $234 = $116;
 $110 = $233;
 $111 = $234;
 $235 = $110;
 $236 = ((($235)) + 4|0);
 $237 = HEAP8[$236>>0]|0;
 $238 = $237&1;
 if ($238) {
  $239 = HEAP32[$235>>2]|0;
  $240 = $111;
  $241 = ((($240)) + 16|0);
  $109 = $241;
  $242 = $109;
  $108 = $242;
  $243 = $108;
  $105 = $239;
  $106 = $243;
  $244 = $105;
  $245 = $106;
  ;HEAP8[$104>>0]=HEAP8[$107>>0]|0;
  $102 = $244;
  $103 = $245;
  $246 = $103;
  __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($246);
 }
 $247 = $111;
 $248 = ($247|0)!=(0|0);
 if (!($248)) {
  STACKTOP = sp;return;
 }
 $249 = HEAP32[$235>>2]|0;
 $250 = $111;
 $99 = $249;
 $100 = $250;
 $101 = 1;
 $251 = $99;
 $252 = $100;
 $253 = $101;
 $96 = $251;
 $97 = $252;
 $98 = $253;
 $254 = $97;
 $95 = $254;
 $255 = $95;
 __ZdlPv($255);
 STACKTOP = sp;return;
}
function __ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__count_multiIcEEmRKT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $16 = 0;
 var $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
 var $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0;
 var $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0;
 var $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0;
 var $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(224|0);
 $31 = sp + 32|0;
 $32 = sp + 24|0;
 $33 = sp + 16|0;
 $34 = sp + 88|0;
 $35 = sp + 84|0;
 $36 = sp + 208|0;
 $37 = sp + 8|0;
 $38 = sp;
 $49 = sp + 40|0;
 $50 = sp + 36|0;
 $45 = $0;
 $46 = $1;
 $51 = $45;
 $43 = $51;
 $52 = $43;
 $53 = ((($52)) + 4|0);
 $42 = $53;
 $54 = $42;
 $41 = $54;
 $55 = $41;
 $40 = $55;
 $56 = $40;
 $39 = $56;
 $57 = $39;
 $47 = $57;
 $19 = $51;
 $58 = $19;
 $18 = $58;
 $59 = $18;
 $60 = ((($59)) + 4|0);
 $17 = $60;
 $61 = $17;
 $16 = $61;
 $62 = $16;
 $15 = $62;
 $63 = $15;
 $14 = $63;
 $64 = $14;
 $65 = HEAP32[$64>>2]|0;
 $48 = $65;
 while(1) {
  $66 = $48;
  $67 = ($66|0)!=(0|0);
  if (!($67)) {
   label = 21;
   break;
  }
  $13 = $51;
  $68 = $13;
  $69 = ((($68)) + 8|0);
  $12 = $69;
  $70 = $12;
  $11 = $70;
  $71 = $11;
  $72 = $46;
  $73 = $48;
  $74 = ((($73)) + 13|0);
  $2 = $71;
  $3 = $72;
  $4 = $74;
  $75 = $3;
  $76 = HEAP8[$75>>0]|0;
  $77 = $76 << 24 >> 24;
  $78 = $4;
  $79 = HEAP8[$78>>0]|0;
  $80 = $79 << 24 >> 24;
  $81 = ($77|0)<($80|0);
  if ($81) {
   $82 = $48;
   $47 = $82;
   $83 = $48;
   $84 = HEAP32[$83>>2]|0;
   $48 = $84;
  } else {
   $7 = $51;
   $85 = $7;
   $86 = ((($85)) + 8|0);
   $6 = $86;
   $87 = $6;
   $5 = $87;
   $88 = $5;
   $89 = $48;
   $90 = ((($89)) + 13|0);
   $91 = $46;
   $8 = $88;
   $9 = $90;
   $10 = $91;
   $92 = $9;
   $93 = HEAP8[$92>>0]|0;
   $94 = $93 << 24 >> 24;
   $95 = $10;
   $96 = HEAP8[$95>>0]|0;
   $97 = $96 << 24 >> 24;
   $98 = ($94|0)<($97|0);
   if (!($98)) {
    break;
   }
   $99 = $48;
   $100 = ((($99)) + 4|0);
   $101 = HEAP32[$100>>2]|0;
   $48 = $101;
  }
 }
 if ((label|0) == 21) {
  $44 = 0;
  $152 = $44;
  STACKTOP = sp;return ($152|0);
 }
 $102 = $46;
 $103 = $48;
 $104 = HEAP32[$103>>2]|0;
 $105 = $48;
 $106 = (__ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__lower_boundIcEENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($51,$102,$104,$105)|0);
 HEAP32[$49>>2] = $106;
 $107 = $46;
 $108 = $48;
 $109 = ((($108)) + 4|0);
 $110 = HEAP32[$109>>2]|0;
 $111 = $47;
 $112 = (__ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__upper_boundIcEENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($51,$107,$110,$111)|0);
 HEAP32[$50>>2] = $112;
 ;HEAP8[$37>>0]=HEAP8[$50>>0]|0;HEAP8[$37+1>>0]=HEAP8[$50+1>>0]|0;HEAP8[$37+2>>0]=HEAP8[$50+2>>0]|0;HEAP8[$37+3>>0]=HEAP8[$50+3>>0]|0;
 ;HEAP8[$38>>0]=HEAP8[$49>>0]|0;HEAP8[$38+1>>0]=HEAP8[$49+1>>0]|0;HEAP8[$38+2>>0]=HEAP8[$49+2>>0]|0;HEAP8[$38+3>>0]=HEAP8[$49+3>>0]|0;
 ;HEAP32[$34>>2]=HEAP32[$38>>2]|0;
 ;HEAP32[$35>>2]=HEAP32[$37>>2]|0;
 ;HEAP8[$31>>0]=HEAP8[$36>>0]|0;
 ;HEAP8[$32>>0]=HEAP8[$35>>0]|0;HEAP8[$32+1>>0]=HEAP8[$35+1>>0]|0;HEAP8[$32+2>>0]=HEAP8[$35+2>>0]|0;HEAP8[$32+3>>0]=HEAP8[$35+3>>0]|0;
 ;HEAP8[$33>>0]=HEAP8[$34>>0]|0;HEAP8[$33+1>>0]=HEAP8[$34+1>>0]|0;HEAP8[$33+2>>0]=HEAP8[$34+2>>0]|0;HEAP8[$33+3>>0]=HEAP8[$34+3>>0]|0;
 $30 = 0;
 while(1) {
  $28 = $33;
  $29 = $32;
  $113 = $28;
  $114 = $29;
  $26 = $113;
  $27 = $114;
  $115 = $26;
  $116 = HEAP32[$115>>2]|0;
  $117 = $27;
  $118 = HEAP32[$117>>2]|0;
  $119 = ($116|0)==($118|0);
  $120 = $119 ^ 1;
  $121 = $30;
  if (!($120)) {
   break;
  }
  $122 = (($121) + 1)|0;
  $30 = $122;
  $25 = $33;
  $123 = $25;
  $124 = HEAP32[$123>>2]|0;
  $24 = $124;
  $125 = $24;
  $126 = ((($125)) + 4|0);
  $127 = HEAP32[$126>>2]|0;
  $128 = ($127|0)!=(0|0);
  if ($128) {
   $129 = $24;
   $130 = ((($129)) + 4|0);
   $131 = HEAP32[$130>>2]|0;
   $22 = $131;
   while(1) {
    $132 = $22;
    $133 = HEAP32[$132>>2]|0;
    $134 = ($133|0)!=(0|0);
    $135 = $22;
    if (!($134)) {
     break;
    }
    $136 = HEAP32[$135>>2]|0;
    $22 = $136;
   }
   $23 = $135;
  } else {
   while(1) {
    $137 = $24;
    $21 = $137;
    $138 = $21;
    $139 = $21;
    $140 = ((($139)) + 8|0);
    $141 = HEAP32[$140>>2]|0;
    $142 = HEAP32[$141>>2]|0;
    $143 = ($138|0)==($142|0);
    $144 = $143 ^ 1;
    $145 = $24;
    if (!($144)) {
     break;
    }
    $20 = $145;
    $146 = $20;
    $147 = ((($146)) + 8|0);
    $148 = HEAP32[$147>>2]|0;
    $24 = $148;
   }
   $149 = ((($145)) + 8|0);
   $150 = HEAP32[$149>>2]|0;
   $23 = $150;
  }
  $151 = $23;
  HEAP32[$123>>2] = $151;
 }
 $44 = $121;
 $152 = $44;
 STACKTOP = sp;return ($152|0);
}
function __ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__lower_boundIcEENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $12 = sp + 16|0;
 $13 = $0;
 $14 = $1;
 $15 = $2;
 $16 = $3;
 $17 = $13;
 while(1) {
  $18 = $15;
  $19 = ($18|0)!=(0|0);
  if (!($19)) {
   break;
  }
  $11 = $17;
  $20 = $11;
  $21 = ((($20)) + 8|0);
  $10 = $21;
  $22 = $10;
  $9 = $22;
  $23 = $9;
  $24 = $15;
  $25 = ((($24)) + 13|0);
  $26 = $14;
  $4 = $23;
  $5 = $25;
  $6 = $26;
  $27 = $5;
  $28 = HEAP8[$27>>0]|0;
  $29 = $28 << 24 >> 24;
  $30 = $6;
  $31 = HEAP8[$30>>0]|0;
  $32 = $31 << 24 >> 24;
  $33 = ($29|0)<($32|0);
  $34 = $15;
  if ($33) {
   $37 = ((($34)) + 4|0);
   $38 = HEAP32[$37>>2]|0;
   $15 = $38;
  } else {
   $16 = $34;
   $35 = $15;
   $36 = HEAP32[$35>>2]|0;
   $15 = $36;
  }
 }
 $39 = $16;
 $7 = $12;
 $8 = $39;
 $40 = $7;
 $41 = $8;
 HEAP32[$40>>2] = $41;
 $42 = HEAP32[$12>>2]|0;
 STACKTOP = sp;return ($42|0);
}
function __ZNKSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__upper_boundIcEENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $12 = sp + 16|0;
 $13 = $0;
 $14 = $1;
 $15 = $2;
 $16 = $3;
 $17 = $13;
 while(1) {
  $18 = $15;
  $19 = ($18|0)!=(0|0);
  if (!($19)) {
   break;
  }
  $11 = $17;
  $20 = $11;
  $21 = ((($20)) + 8|0);
  $10 = $21;
  $22 = $10;
  $9 = $22;
  $23 = $9;
  $24 = $14;
  $25 = $15;
  $26 = ((($25)) + 13|0);
  $4 = $23;
  $5 = $24;
  $6 = $26;
  $27 = $5;
  $28 = HEAP8[$27>>0]|0;
  $29 = $28 << 24 >> 24;
  $30 = $6;
  $31 = HEAP8[$30>>0]|0;
  $32 = $31 << 24 >> 24;
  $33 = ($29|0)<($32|0);
  $34 = $15;
  if ($33) {
   $16 = $34;
   $35 = $15;
   $36 = HEAP32[$35>>2]|0;
   $15 = $36;
  } else {
   $37 = ((($34)) + 4|0);
   $38 = HEAP32[$37>>2]|0;
   $15 = $38;
  }
 }
 $39 = $16;
 $7 = $12;
 $8 = $39;
 $40 = $7;
 $41 = $8;
 HEAP32[$40>>2] = $41;
 $42 = HEAP32[$12>>2]|0;
 STACKTOP = sp;return ($42|0);
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE13__lower_boundIcEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEERKT_SB_PNS_15__tree_end_nodeIPNS_16__tree_node_baseIS9_EEEE($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $12 = sp + 16|0;
 $13 = $0;
 $14 = $1;
 $15 = $2;
 $16 = $3;
 $17 = $13;
 while(1) {
  $18 = $15;
  $19 = ($18|0)!=(0|0);
  if (!($19)) {
   break;
  }
  $11 = $17;
  $20 = $11;
  $21 = ((($20)) + 8|0);
  $10 = $21;
  $22 = $10;
  $9 = $22;
  $23 = $9;
  $24 = $15;
  $25 = ((($24)) + 13|0);
  $26 = $14;
  $4 = $23;
  $5 = $25;
  $6 = $26;
  $27 = $5;
  $28 = HEAP8[$27>>0]|0;
  $29 = $28 << 24 >> 24;
  $30 = $6;
  $31 = HEAP8[$30>>0]|0;
  $32 = $31 << 24 >> 24;
  $33 = ($29|0)<($32|0);
  $34 = $15;
  if ($33) {
   $37 = ((($34)) + 4|0);
   $38 = HEAP32[$37>>2]|0;
   $15 = $38;
  } else {
   $16 = $34;
   $35 = $15;
   $36 = HEAP32[$35>>2]|0;
   $15 = $36;
  }
 }
 $39 = $16;
 $7 = $12;
 $8 = $39;
 $40 = $7;
 $41 = $8;
 HEAP32[$40>>2] = $41;
 $42 = HEAP32[$12>>2]|0;
 STACKTOP = sp;return ($42|0);
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE5eraseENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEE($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0;
 var $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 176|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(176|0);
 $27 = sp;
 $30 = sp + 168|0;
 $41 = sp + 16|0;
 $42 = $0;
 $45 = $42;
 $40 = $1;
 $46 = $40;
 $47 = HEAP32[$46>>2]|0;
 $43 = $47;
 $48 = HEAP32[$1>>2]|0;
 $31 = $41;
 $32 = $48;
 $49 = $31;
 $50 = $32;
 HEAP32[$49>>2] = $50;
 $20 = $41;
 $51 = $20;
 $52 = HEAP32[$51>>2]|0;
 $19 = $52;
 $53 = $19;
 $54 = ((($53)) + 4|0);
 $55 = HEAP32[$54>>2]|0;
 $56 = ($55|0)!=(0|0);
 if ($56) {
  $57 = $19;
  $58 = ((($57)) + 4|0);
  $59 = HEAP32[$58>>2]|0;
  $17 = $59;
  while(1) {
   $60 = $17;
   $61 = HEAP32[$60>>2]|0;
   $62 = ($61|0)!=(0|0);
   $63 = $17;
   if (!($62)) {
    break;
   }
   $64 = HEAP32[$63>>2]|0;
   $17 = $64;
  }
  $18 = $63;
 } else {
  while(1) {
   $65 = $19;
   $16 = $65;
   $66 = $16;
   $67 = $16;
   $68 = ((($67)) + 8|0);
   $69 = HEAP32[$68>>2]|0;
   $70 = HEAP32[$69>>2]|0;
   $71 = ($66|0)==($70|0);
   $72 = $71 ^ 1;
   $73 = $19;
   if (!($72)) {
    break;
   }
   $15 = $73;
   $74 = $15;
   $75 = ((($74)) + 8|0);
   $76 = HEAP32[$75>>2]|0;
   $19 = $76;
  }
  $77 = ((($73)) + 8|0);
  $78 = HEAP32[$77>>2]|0;
  $18 = $78;
 }
 $79 = $18;
 HEAP32[$51>>2] = $79;
 $2 = $45;
 $80 = $2;
 $81 = HEAP32[$80>>2]|0;
 $82 = HEAP32[$1>>2]|0;
 $83 = ($81|0)==($82|0);
 if ($83) {
  $84 = HEAP32[$41>>2]|0;
  $3 = $45;
  $85 = $3;
  HEAP32[$85>>2] = $84;
 }
 $6 = $45;
 $86 = $6;
 $87 = ((($86)) + 8|0);
 $5 = $87;
 $88 = $5;
 $4 = $88;
 $89 = $4;
 $90 = HEAP32[$89>>2]|0;
 $91 = (($90) + -1)|0;
 HEAP32[$89>>2] = $91;
 $9 = $45;
 $92 = $9;
 $93 = ((($92)) + 4|0);
 $8 = $93;
 $94 = $8;
 $7 = $94;
 $95 = $7;
 $44 = $95;
 $14 = $45;
 $96 = $14;
 $97 = ((($96)) + 4|0);
 $13 = $97;
 $98 = $13;
 $12 = $98;
 $99 = $12;
 $11 = $99;
 $100 = $11;
 $10 = $100;
 $101 = $10;
 $102 = HEAP32[$101>>2]|0;
 $103 = $43;
 __ZNSt3__213__tree_removeIPNS_16__tree_node_baseIPvEEEEvT_S5_($102,$103);
 $104 = $44;
 $22 = $1;
 $105 = $22;
 $21 = $105;
 $106 = $21;
 $107 = HEAP32[$106>>2]|0;
 $108 = ((($107)) + 13|0);
 $24 = $108;
 $109 = $24;
 $23 = $109;
 $110 = $23;
 $28 = $104;
 $29 = $110;
 $111 = $28;
 $112 = $29;
 ;HEAP8[$27>>0]=HEAP8[$30>>0]|0;
 $25 = $111;
 $26 = $112;
 $113 = $44;
 $114 = $43;
 $37 = $113;
 $38 = $114;
 $39 = 1;
 $115 = $37;
 $116 = $38;
 $117 = $39;
 $34 = $115;
 $35 = $116;
 $36 = $117;
 $118 = $35;
 $33 = $118;
 $119 = $33;
 __ZdlPv($119);
 $120 = HEAP32[$41>>2]|0;
 STACKTOP = sp;return ($120|0);
}
function __ZNSt3__213__tree_removeIPNS_16__tree_node_baseIPvEEEEvT_S5_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0;
 var $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0;
 var $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0;
 var $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0;
 var $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0;
 var $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0;
 var $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0;
 var $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0;
 var $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0;
 var $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0;
 var $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0;
 var $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0;
 var $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 144|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(144|0);
 $30 = $0;
 $31 = $1;
 $36 = $31;
 $37 = HEAP32[$36>>2]|0;
 $38 = ($37|0)==(0|0);
 if ($38) {
  label = 3;
 } else {
  $39 = $31;
  $40 = ((($39)) + 4|0);
  $41 = HEAP32[$40>>2]|0;
  $42 = ($41|0)==(0|0);
  if ($42) {
   label = 3;
  } else {
   $44 = $31;
   $45 = (__ZNSt3__211__tree_nextIPNS_16__tree_node_baseIPvEEEET_S5_($44)|0);
   $46 = $45;
  }
 }
 if ((label|0) == 3) {
  $43 = $31;
  $46 = $43;
 }
 $32 = $46;
 $47 = $32;
 $48 = HEAP32[$47>>2]|0;
 $49 = ($48|0)!=(0|0);
 $50 = $32;
 if ($49) {
  $51 = HEAP32[$50>>2]|0;
  $54 = $51;
 } else {
  $52 = ((($50)) + 4|0);
  $53 = HEAP32[$52>>2]|0;
  $54 = $53;
 }
 $33 = $54;
 $34 = 0;
 $55 = $33;
 $56 = ($55|0)!=(0|0);
 if ($56) {
  $57 = $32;
  $58 = ((($57)) + 8|0);
  $59 = HEAP32[$58>>2]|0;
  $60 = $33;
  $61 = ((($60)) + 8|0);
  HEAP32[$61>>2] = $59;
 }
 $62 = $32;
 $29 = $62;
 $63 = $29;
 $64 = $29;
 $65 = ((($64)) + 8|0);
 $66 = HEAP32[$65>>2]|0;
 $67 = HEAP32[$66>>2]|0;
 $68 = ($63|0)==($67|0);
 $69 = $33;
 $70 = $32;
 do {
  if ($68) {
   $71 = ((($70)) + 8|0);
   $72 = HEAP32[$71>>2]|0;
   HEAP32[$72>>2] = $69;
   $73 = $32;
   $74 = $30;
   $75 = ($73|0)!=($74|0);
   if ($75) {
    $76 = $32;
    $28 = $76;
    $77 = $28;
    $78 = ((($77)) + 8|0);
    $79 = HEAP32[$78>>2]|0;
    $80 = ((($79)) + 4|0);
    $81 = HEAP32[$80>>2]|0;
    $34 = $81;
    break;
   } else {
    $82 = $33;
    $30 = $82;
    break;
   }
  } else {
   $27 = $70;
   $83 = $27;
   $84 = ((($83)) + 8|0);
   $85 = HEAP32[$84>>2]|0;
   $86 = ((($85)) + 4|0);
   HEAP32[$86>>2] = $69;
   $87 = $32;
   $88 = ((($87)) + 8|0);
   $89 = HEAP32[$88>>2]|0;
   $90 = HEAP32[$89>>2]|0;
   $34 = $90;
  }
 } while(0);
 $91 = $32;
 $92 = ((($91)) + 12|0);
 $93 = HEAP8[$92>>0]|0;
 $94 = $93&1;
 $95 = $94&1;
 $35 = $95;
 $96 = $32;
 $97 = $31;
 $98 = ($96|0)!=($97|0);
 if ($98) {
  $99 = $31;
  $100 = ((($99)) + 8|0);
  $101 = HEAP32[$100>>2]|0;
  $102 = $32;
  $103 = ((($102)) + 8|0);
  HEAP32[$103>>2] = $101;
  $104 = $31;
  $22 = $104;
  $105 = $22;
  $106 = $22;
  $107 = ((($106)) + 8|0);
  $108 = HEAP32[$107>>2]|0;
  $109 = HEAP32[$108>>2]|0;
  $110 = ($105|0)==($109|0);
  $111 = $32;
  $112 = $32;
  if ($110) {
   $113 = ((($112)) + 8|0);
   $114 = HEAP32[$113>>2]|0;
   HEAP32[$114>>2] = $111;
  } else {
   $18 = $112;
   $115 = $18;
   $116 = ((($115)) + 8|0);
   $117 = HEAP32[$116>>2]|0;
   $118 = ((($117)) + 4|0);
   HEAP32[$118>>2] = $111;
  }
  $119 = $31;
  $120 = HEAP32[$119>>2]|0;
  $121 = $32;
  HEAP32[$121>>2] = $120;
  $122 = $32;
  $123 = HEAP32[$122>>2]|0;
  $124 = $32;
  $14 = $123;
  $15 = $124;
  $125 = $14;
  $126 = $15;
  $127 = ((($125)) + 8|0);
  HEAP32[$127>>2] = $126;
  $128 = $31;
  $129 = ((($128)) + 4|0);
  $130 = HEAP32[$129>>2]|0;
  $131 = $32;
  $132 = ((($131)) + 4|0);
  HEAP32[$132>>2] = $130;
  $133 = $32;
  $134 = ((($133)) + 4|0);
  $135 = HEAP32[$134>>2]|0;
  $136 = ($135|0)!=(0|0);
  if ($136) {
   $137 = $32;
   $138 = ((($137)) + 4|0);
   $139 = HEAP32[$138>>2]|0;
   $140 = $32;
   $8 = $139;
   $9 = $140;
   $141 = $8;
   $142 = $9;
   $143 = ((($141)) + 8|0);
   HEAP32[$143>>2] = $142;
  }
  $144 = $31;
  $145 = ((($144)) + 12|0);
  $146 = HEAP8[$145>>0]|0;
  $147 = $146&1;
  $148 = $32;
  $149 = ((($148)) + 12|0);
  $150 = $147&1;
  HEAP8[$149>>0] = $150;
  $151 = $30;
  $152 = $31;
  $153 = ($151|0)==($152|0);
  if ($153) {
   $154 = $32;
   $30 = $154;
  }
 }
 $155 = $35;
 $156 = $155&1;
 $157 = $30;
 $158 = ($157|0)!=(0|0);
 $or$cond = $156 & $158;
 if (!($or$cond)) {
  STACKTOP = sp;return;
 }
 $159 = $33;
 $160 = ($159|0)!=(0|0);
 if ($160) {
  $161 = $33;
  $162 = ((($161)) + 12|0);
  HEAP8[$162>>0] = 1;
  STACKTOP = sp;return;
 }
 while(1) {
  $163 = $34;
  $4 = $163;
  $164 = $4;
  $165 = $4;
  $166 = ((($165)) + 8|0);
  $167 = HEAP32[$166>>2]|0;
  $168 = HEAP32[$167>>2]|0;
  $169 = ($164|0)==($168|0);
  $170 = $34;
  $171 = ((($170)) + 12|0);
  $172 = HEAP8[$171>>0]|0;
  $173 = $172&1;
  if ($169) {
   if (!($173)) {
    $287 = $34;
    $288 = ((($287)) + 12|0);
    HEAP8[$288>>0] = 1;
    $289 = $34;
    $16 = $289;
    $290 = $16;
    $291 = ((($290)) + 8|0);
    $292 = HEAP32[$291>>2]|0;
    $293 = ((($292)) + 12|0);
    HEAP8[$293>>0] = 0;
    $294 = $34;
    $17 = $294;
    $295 = $17;
    $296 = ((($295)) + 8|0);
    $297 = HEAP32[$296>>2]|0;
    __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($297);
    $298 = $30;
    $299 = $34;
    $300 = ((($299)) + 4|0);
    $301 = HEAP32[$300>>2]|0;
    $302 = ($298|0)==($301|0);
    if ($302) {
     $303 = $34;
     $30 = $303;
    }
    $304 = $34;
    $305 = ((($304)) + 4|0);
    $306 = HEAP32[$305>>2]|0;
    $307 = HEAP32[$306>>2]|0;
    $34 = $307;
   }
   $308 = $34;
   $309 = HEAP32[$308>>2]|0;
   $310 = ($309|0)==(0|0);
   if (!($310)) {
    $311 = $34;
    $312 = HEAP32[$311>>2]|0;
    $313 = ((($312)) + 12|0);
    $314 = HEAP8[$313>>0]|0;
    $315 = $314&1;
    if (!($315)) {
     label = 62;
     break;
    }
   }
   $316 = $34;
   $317 = ((($316)) + 4|0);
   $318 = HEAP32[$317>>2]|0;
   $319 = ($318|0)==(0|0);
   if (!($319)) {
    $320 = $34;
    $321 = ((($320)) + 4|0);
    $322 = HEAP32[$321>>2]|0;
    $323 = ((($322)) + 12|0);
    $324 = HEAP8[$323>>0]|0;
    $325 = $324&1;
    if (!($325)) {
     label = 62;
     break;
    }
   }
   $326 = $34;
   $327 = ((($326)) + 12|0);
   HEAP8[$327>>0] = 0;
   $328 = $34;
   $19 = $328;
   $329 = $19;
   $330 = ((($329)) + 8|0);
   $331 = HEAP32[$330>>2]|0;
   $33 = $331;
   $332 = $33;
   $333 = ((($332)) + 12|0);
   $334 = HEAP8[$333>>0]|0;
   $335 = $334&1;
   if (!($335)) {
    label = 57;
    break;
   }
   $336 = $33;
   $337 = $30;
   $338 = ($336|0)==($337|0);
   if ($338) {
    label = 57;
    break;
   }
   $341 = $33;
   $20 = $341;
   $342 = $20;
   $343 = $20;
   $344 = ((($343)) + 8|0);
   $345 = HEAP32[$344>>2]|0;
   $346 = HEAP32[$345>>2]|0;
   $347 = ($342|0)==($346|0);
   $348 = $33;
   if ($347) {
    $21 = $348;
    $349 = $21;
    $350 = ((($349)) + 8|0);
    $351 = HEAP32[$350>>2]|0;
    $352 = ((($351)) + 4|0);
    $353 = HEAP32[$352>>2]|0;
    $357 = $353;
   } else {
    $354 = ((($348)) + 8|0);
    $355 = HEAP32[$354>>2]|0;
    $356 = HEAP32[$355>>2]|0;
    $357 = $356;
   }
   $34 = $357;
  } else {
   if (!($173)) {
    $174 = $34;
    $175 = ((($174)) + 12|0);
    HEAP8[$175>>0] = 1;
    $176 = $34;
    $2 = $176;
    $177 = $2;
    $178 = ((($177)) + 8|0);
    $179 = HEAP32[$178>>2]|0;
    $180 = ((($179)) + 12|0);
    HEAP8[$180>>0] = 0;
    $181 = $34;
    $3 = $181;
    $182 = $3;
    $183 = ((($182)) + 8|0);
    $184 = HEAP32[$183>>2]|0;
    __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($184);
    $185 = $30;
    $186 = $34;
    $187 = HEAP32[$186>>2]|0;
    $188 = ($185|0)==($187|0);
    if ($188) {
     $189 = $34;
     $30 = $189;
    }
    $190 = $34;
    $191 = HEAP32[$190>>2]|0;
    $192 = ((($191)) + 4|0);
    $193 = HEAP32[$192>>2]|0;
    $34 = $193;
   }
   $194 = $34;
   $195 = HEAP32[$194>>2]|0;
   $196 = ($195|0)==(0|0);
   if (!($196)) {
    $197 = $34;
    $198 = HEAP32[$197>>2]|0;
    $199 = ((($198)) + 12|0);
    $200 = HEAP8[$199>>0]|0;
    $201 = $200&1;
    if (!($201)) {
     label = 43;
     break;
    }
   }
   $202 = $34;
   $203 = ((($202)) + 4|0);
   $204 = HEAP32[$203>>2]|0;
   $205 = ($204|0)==(0|0);
   if (!($205)) {
    $206 = $34;
    $207 = ((($206)) + 4|0);
    $208 = HEAP32[$207>>2]|0;
    $209 = ((($208)) + 12|0);
    $210 = HEAP8[$209>>0]|0;
    $211 = $210&1;
    if (!($211)) {
     label = 43;
     break;
    }
   }
   $212 = $34;
   $213 = ((($212)) + 12|0);
   HEAP8[$213>>0] = 0;
   $214 = $34;
   $5 = $214;
   $215 = $5;
   $216 = ((($215)) + 8|0);
   $217 = HEAP32[$216>>2]|0;
   $33 = $217;
   $218 = $33;
   $219 = $30;
   $220 = ($218|0)==($219|0);
   if ($220) {
    label = 38;
    break;
   }
   $221 = $33;
   $222 = ((($221)) + 12|0);
   $223 = HEAP8[$222>>0]|0;
   $224 = $223&1;
   if (!($224)) {
    label = 38;
    break;
   }
   $227 = $33;
   $6 = $227;
   $228 = $6;
   $229 = $6;
   $230 = ((($229)) + 8|0);
   $231 = HEAP32[$230>>2]|0;
   $232 = HEAP32[$231>>2]|0;
   $233 = ($228|0)==($232|0);
   $234 = $33;
   if ($233) {
    $7 = $234;
    $235 = $7;
    $236 = ((($235)) + 8|0);
    $237 = HEAP32[$236>>2]|0;
    $238 = ((($237)) + 4|0);
    $239 = HEAP32[$238>>2]|0;
    $243 = $239;
   } else {
    $240 = ((($234)) + 8|0);
    $241 = HEAP32[$240>>2]|0;
    $242 = HEAP32[$241>>2]|0;
    $243 = $242;
   }
   $34 = $243;
  }
 }
 if ((label|0) == 38) {
  $225 = $33;
  $226 = ((($225)) + 12|0);
  HEAP8[$226>>0] = 1;
  STACKTOP = sp;return;
 }
 else if ((label|0) == 43) {
  $244 = $34;
  $245 = ((($244)) + 4|0);
  $246 = HEAP32[$245>>2]|0;
  $247 = ($246|0)==(0|0);
  if ($247) {
   label = 45;
  } else {
   $248 = $34;
   $249 = ((($248)) + 4|0);
   $250 = HEAP32[$249>>2]|0;
   $251 = ((($250)) + 12|0);
   $252 = HEAP8[$251>>0]|0;
   $253 = $252&1;
   if ($253) {
    label = 45;
   }
  }
  if ((label|0) == 45) {
   $254 = $34;
   $255 = HEAP32[$254>>2]|0;
   $256 = ((($255)) + 12|0);
   HEAP8[$256>>0] = 1;
   $257 = $34;
   $258 = ((($257)) + 12|0);
   HEAP8[$258>>0] = 0;
   $259 = $34;
   __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($259);
   $260 = $34;
   $10 = $260;
   $261 = $10;
   $262 = ((($261)) + 8|0);
   $263 = HEAP32[$262>>2]|0;
   $34 = $263;
  }
  $264 = $34;
  $11 = $264;
  $265 = $11;
  $266 = ((($265)) + 8|0);
  $267 = HEAP32[$266>>2]|0;
  $268 = ((($267)) + 12|0);
  $269 = HEAP8[$268>>0]|0;
  $270 = $269&1;
  $271 = $34;
  $272 = ((($271)) + 12|0);
  $273 = $270&1;
  HEAP8[$272>>0] = $273;
  $274 = $34;
  $12 = $274;
  $275 = $12;
  $276 = ((($275)) + 8|0);
  $277 = HEAP32[$276>>2]|0;
  $278 = ((($277)) + 12|0);
  HEAP8[$278>>0] = 1;
  $279 = $34;
  $280 = ((($279)) + 4|0);
  $281 = HEAP32[$280>>2]|0;
  $282 = ((($281)) + 12|0);
  HEAP8[$282>>0] = 1;
  $283 = $34;
  $13 = $283;
  $284 = $13;
  $285 = ((($284)) + 8|0);
  $286 = HEAP32[$285>>2]|0;
  __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($286);
  STACKTOP = sp;return;
 }
 else if ((label|0) == 57) {
  $339 = $33;
  $340 = ((($339)) + 12|0);
  HEAP8[$340>>0] = 1;
  STACKTOP = sp;return;
 }
 else if ((label|0) == 62) {
  $358 = $34;
  $359 = HEAP32[$358>>2]|0;
  $360 = ($359|0)==(0|0);
  if ($360) {
   label = 64;
  } else {
   $361 = $34;
   $362 = HEAP32[$361>>2]|0;
   $363 = ((($362)) + 12|0);
   $364 = HEAP8[$363>>0]|0;
   $365 = $364&1;
   if ($365) {
    label = 64;
   }
  }
  if ((label|0) == 64) {
   $366 = $34;
   $367 = ((($366)) + 4|0);
   $368 = HEAP32[$367>>2]|0;
   $369 = ((($368)) + 12|0);
   HEAP8[$369>>0] = 1;
   $370 = $34;
   $371 = ((($370)) + 12|0);
   HEAP8[$371>>0] = 0;
   $372 = $34;
   __ZNSt3__218__tree_left_rotateIPNS_16__tree_node_baseIPvEEEEvT_($372);
   $373 = $34;
   $23 = $373;
   $374 = $23;
   $375 = ((($374)) + 8|0);
   $376 = HEAP32[$375>>2]|0;
   $34 = $376;
  }
  $377 = $34;
  $24 = $377;
  $378 = $24;
  $379 = ((($378)) + 8|0);
  $380 = HEAP32[$379>>2]|0;
  $381 = ((($380)) + 12|0);
  $382 = HEAP8[$381>>0]|0;
  $383 = $382&1;
  $384 = $34;
  $385 = ((($384)) + 12|0);
  $386 = $383&1;
  HEAP8[$385>>0] = $386;
  $387 = $34;
  $25 = $387;
  $388 = $25;
  $389 = ((($388)) + 8|0);
  $390 = HEAP32[$389>>2]|0;
  $391 = ((($390)) + 12|0);
  HEAP8[$391>>0] = 1;
  $392 = $34;
  $393 = HEAP32[$392>>2]|0;
  $394 = ((($393)) + 12|0);
  HEAP8[$394>>0] = 1;
  $395 = $34;
  $26 = $395;
  $396 = $26;
  $397 = ((($396)) + 8|0);
  $398 = HEAP32[$397>>2]|0;
  __ZNSt3__219__tree_right_rotateIPNS_16__tree_node_baseIPvEEEEvT_($398);
  STACKTOP = sp;return;
 }
}
function __ZNSt3__211__tree_nextIPNS_16__tree_node_baseIPvEEEET_S5_($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $6 = $0;
 $7 = $6;
 $8 = ((($7)) + 4|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = ($9|0)!=(0|0);
 if ($10) {
  $11 = $6;
  $12 = ((($11)) + 4|0);
  $13 = HEAP32[$12>>2]|0;
  $4 = $13;
  while(1) {
   $14 = $4;
   $15 = HEAP32[$14>>2]|0;
   $16 = ($15|0)!=(0|0);
   $17 = $4;
   if (!($16)) {
    break;
   }
   $18 = HEAP32[$17>>2]|0;
   $4 = $18;
  }
  $5 = $17;
  $34 = $5;
  STACKTOP = sp;return ($34|0);
 } else {
  while(1) {
   $19 = $6;
   $3 = $19;
   $20 = $3;
   $21 = $3;
   $22 = ((($21)) + 8|0);
   $23 = HEAP32[$22>>2]|0;
   $24 = HEAP32[$23>>2]|0;
   $25 = ($20|0)==($24|0);
   $26 = $25 ^ 1;
   $27 = $6;
   if (!($26)) {
    break;
   }
   $1 = $27;
   $28 = $1;
   $29 = ((($28)) + 8|0);
   $30 = HEAP32[$29>>2]|0;
   $6 = $30;
  }
  $2 = $27;
  $31 = $2;
  $32 = ((($31)) + 8|0);
  $33 = HEAP32[$32>>2]|0;
  $5 = $33;
  $34 = $5;
  STACKTOP = sp;return ($34|0);
 }
 return (0)|0;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSB_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 112|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(112|0);
 $26 = sp;
 $24 = $0;
 $25 = $1;
 $27 = $24;
 $28 = ((($27)) + 4|0);
 $23 = $28;
 $29 = $23;
 $22 = $29;
 $30 = $22;
 $21 = $30;
 $31 = $21;
 HEAP32[$31>>2] = 0;
 $20 = $29;
 $32 = $20;
 $19 = $32;
 $33 = ((($27)) + 8|0);
 HEAP32[$26>>2] = 0;
 $34 = $25;
 $16 = $33;
 $17 = $26;
 $18 = $34;
 $35 = $16;
 $36 = $17;
 $15 = $36;
 $37 = $15;
 $9 = $35;
 $10 = $37;
 $38 = $9;
 $39 = $10;
 $8 = $39;
 $40 = $8;
 $41 = HEAP32[$40>>2]|0;
 HEAP32[$38>>2] = $41;
 $42 = $18;
 $11 = $42;
 $43 = $11;
 $13 = $35;
 $14 = $43;
 $44 = $14;
 $12 = $44;
 $6 = $27;
 $45 = $6;
 $46 = ((($45)) + 4|0);
 $5 = $46;
 $47 = $5;
 $4 = $47;
 $48 = $4;
 $3 = $48;
 $49 = $3;
 $2 = $49;
 $50 = $2;
 $7 = $27;
 $51 = $7;
 HEAP32[$51>>2] = $50;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEEC2ERKSD_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0;
 var $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 160|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(160|0);
 $3 = sp + 8|0;
 $5 = sp + 158|0;
 $14 = sp;
 $40 = sp + 157|0;
 $41 = sp + 156|0;
 $42 = sp + 12|0;
 $38 = $0;
 $39 = $1;
 $43 = $38;
 HEAP32[$43>>2] = 0;
 $44 = ((($43)) + 4|0);
 $45 = $39;
 $37 = $45;
 $46 = $37;
 $47 = ((($46)) + 4|0);
 $36 = $47;
 $48 = $36;
 $35 = $48;
 $49 = $35;
 $4 = $49;
 $50 = $4;
 ;HEAP8[$3>>0]=HEAP8[$5>>0]|0;
 $2 = $50;
 ;HEAP8[$14>>0]=HEAP8[$40>>0]|0;
 $12 = $44;
 $13 = $41;
 $51 = $12;
 $11 = $51;
 $52 = $11;
 $10 = $52;
 $53 = $10;
 HEAP32[$53>>2] = 0;
 $54 = $13;
 $6 = $54;
 $55 = $6;
 $8 = $51;
 $9 = $55;
 $56 = $9;
 $7 = $56;
 $57 = ((($43)) + 8|0);
 HEAP32[$42>>2] = 0;
 $58 = $39;
 $17 = $58;
 $59 = $17;
 $60 = ((($59)) + 8|0);
 $16 = $60;
 $61 = $16;
 $15 = $61;
 $62 = $15;
 $26 = $57;
 $27 = $42;
 $28 = $62;
 $63 = $26;
 $64 = $27;
 $25 = $64;
 $65 = $25;
 $19 = $63;
 $20 = $65;
 $66 = $19;
 $67 = $20;
 $18 = $67;
 $68 = $18;
 $69 = HEAP32[$68>>2]|0;
 HEAP32[$66>>2] = $69;
 $70 = $28;
 $21 = $70;
 $71 = $21;
 $23 = $63;
 $24 = $71;
 $72 = $24;
 $22 = $72;
 $33 = $43;
 $73 = $33;
 $74 = ((($73)) + 4|0);
 $32 = $74;
 $75 = $32;
 $31 = $75;
 $76 = $31;
 $30 = $76;
 $77 = $30;
 $29 = $77;
 $78 = $29;
 $34 = $43;
 $79 = $34;
 HEAP32[$79>>2] = $78;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE30__emplace_hint_unique_key_argsIiJRKNS_4pairIKiS7_EEEEENS_15__tree_iteratorIS8_PNS_11__tree_nodeIS8_PvEElEENS_21__tree_const_iteratorIS8_SO_lEERKT_DpOT0_($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$byval_copy = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $12 = 0, $13 = 0;
 var $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0;
 var $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0;
 var $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0;
 var $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0;
 var $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 208|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(208|0);
 $$byval_copy = sp + 200|0;
 $17 = sp;
 $20 = sp + 204|0;
 $43 = sp + 48|0;
 $47 = sp + 32|0;
 $48 = sp + 28|0;
 $50 = sp + 20|0;
 $52 = sp + 4|0;
 $44 = $0;
 $45 = $2;
 $46 = $3;
 $53 = $44;
 ;HEAP32[$50>>2]=HEAP32[$1>>2]|0;
 $54 = $45;
 ;HEAP32[$$byval_copy>>2]=HEAP32[$50>>2]|0;
 $55 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEENS_21__tree_const_iteratorIS8_PNS_11__tree_nodeIS8_SG_EElEERPNS_15__tree_end_nodeISI_EESJ_RKT_($53,$$byval_copy,$47,$48,$54)|0);
 $49 = $55;
 $56 = $49;
 $57 = HEAP32[$56>>2]|0;
 $51 = $57;
 $58 = $49;
 $59 = HEAP32[$58>>2]|0;
 $60 = ($59|0)==(0|0);
 if (!($60)) {
  $111 = $51;
  $40 = $43;
  $41 = $111;
  $112 = $40;
  $113 = $41;
  HEAP32[$112>>2] = $113;
  $114 = HEAP32[$43>>2]|0;
  STACKTOP = sp;return ($114|0);
 }
 $61 = $46;
 $42 = $61;
 $62 = $42;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_4pairIKiS7_EEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISN_EEEEEEDpOT_($52,$53,$62);
 $63 = HEAP32[$47>>2]|0;
 $64 = $49;
 $39 = $52;
 $65 = $39;
 $38 = $65;
 $66 = $38;
 $37 = $66;
 $67 = $37;
 $68 = HEAP32[$67>>2]|0;
 __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSI_SI_($53,$63,$64,$68);
 $35 = $52;
 $69 = $35;
 $34 = $69;
 $70 = $34;
 $33 = $70;
 $71 = $33;
 $72 = HEAP32[$71>>2]|0;
 $36 = $72;
 $32 = $69;
 $73 = $32;
 $31 = $73;
 $74 = $31;
 HEAP32[$74>>2] = 0;
 $75 = $36;
 $51 = $75;
 $30 = $52;
 $76 = $30;
 $27 = $76;
 $28 = 0;
 $77 = $27;
 $26 = $77;
 $78 = $26;
 $25 = $78;
 $79 = $25;
 $80 = HEAP32[$79>>2]|0;
 $29 = $80;
 $81 = $28;
 $7 = $77;
 $82 = $7;
 $6 = $82;
 $83 = $6;
 HEAP32[$83>>2] = $81;
 $84 = $29;
 $85 = ($84|0)!=(0|0);
 if (!($85)) {
  $111 = $51;
  $40 = $43;
  $41 = $111;
  $112 = $40;
  $113 = $41;
  HEAP32[$112>>2] = $113;
  $114 = HEAP32[$43>>2]|0;
  STACKTOP = sp;return ($114|0);
 }
 $5 = $77;
 $86 = $5;
 $87 = ((($86)) + 4|0);
 $4 = $87;
 $88 = $4;
 $89 = $29;
 $23 = $88;
 $24 = $89;
 $90 = $23;
 $91 = ((($90)) + 4|0);
 $92 = HEAP8[$91>>0]|0;
 $93 = $92&1;
 if ($93) {
  $94 = HEAP32[$90>>2]|0;
  $95 = $24;
  $96 = ((($95)) + 16|0);
  $22 = $96;
  $97 = $22;
  $21 = $97;
  $98 = $21;
  $18 = $94;
  $19 = $98;
  $99 = $18;
  $100 = $19;
  ;HEAP8[$17>>0]=HEAP8[$20>>0]|0;
  $15 = $99;
  $16 = $100;
  $101 = $16;
  __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($101);
 }
 $102 = $24;
 $103 = ($102|0)!=(0|0);
 if (!($103)) {
  $111 = $51;
  $40 = $43;
  $41 = $111;
  $112 = $40;
  $113 = $41;
  HEAP32[$112>>2] = $113;
  $114 = HEAP32[$43>>2]|0;
  STACKTOP = sp;return ($114|0);
 }
 $104 = HEAP32[$90>>2]|0;
 $105 = $24;
 $12 = $104;
 $13 = $105;
 $14 = 1;
 $106 = $12;
 $107 = $13;
 $108 = $14;
 $9 = $106;
 $10 = $107;
 $11 = $108;
 $109 = $10;
 $8 = $109;
 $110 = $8;
 __ZdlPv($110);
 $111 = $51;
 $40 = $43;
 $41 = $111;
 $112 = $40;
 $113 = $41;
 HEAP32[$112>>2] = $113;
 $114 = HEAP32[$43>>2]|0;
 STACKTOP = sp;return ($114|0);
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEENS_21__tree_const_iteratorIS8_PNS_11__tree_nodeIS8_SG_EElEERPNS_15__tree_end_nodeISI_EESJ_RKT_($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0;
 var $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0;
 var $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0;
 var $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0;
 var $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0;
 var $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0;
 var $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0;
 var $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0;
 var $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0;
 var $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0;
 var $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0;
 var $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 528|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(528|0);
 $19 = sp + 452|0;
 $22 = sp + 32|0;
 $73 = sp + 24|0;
 $76 = sp + 512|0;
 $77 = sp + 232|0;
 $79 = sp + 16|0;
 $87 = sp + 196|0;
 $90 = sp + 8|0;
 $106 = sp;
 $114 = sp + 96|0;
 $121 = sp + 68|0;
 $122 = sp + 64|0;
 $123 = sp + 60|0;
 $124 = sp + 56|0;
 $125 = sp + 52|0;
 $126 = sp + 48|0;
 $127 = sp + 44|0;
 $128 = sp + 40|0;
 $129 = sp + 36|0;
 $117 = $0;
 $118 = $2;
 $119 = $3;
 $120 = $4;
 $130 = $117;
 $115 = $130;
 $131 = $115;
 $113 = $131;
 $132 = $113;
 $133 = ((($132)) + 4|0);
 $112 = $133;
 $134 = $112;
 $111 = $134;
 $135 = $111;
 $110 = $135;
 $136 = $110;
 $109 = $136;
 $137 = $109;
 $107 = $114;
 $108 = $137;
 $138 = $107;
 $139 = $108;
 HEAP32[$138>>2] = $139;
 $140 = HEAP32[$114>>2]|0;
 HEAP32[$122>>2] = $140;
 ;HEAP8[$106>>0]=HEAP8[$122>>0]|0;HEAP8[$106+1>>0]=HEAP8[$122+1>>0]|0;HEAP8[$106+2>>0]=HEAP8[$122+2>>0]|0;HEAP8[$106+3>>0]=HEAP8[$122+3>>0]|0;
 $105 = $121;
 $141 = $105;
 $142 = HEAP32[$106>>2]|0;
 HEAP32[$141>>2] = $142;
 $44 = $1;
 $45 = $121;
 $143 = $44;
 $144 = HEAP32[$143>>2]|0;
 $145 = $45;
 $146 = HEAP32[$145>>2]|0;
 $147 = ($144|0)==($146|0);
 if (!($147)) {
  $7 = $130;
  $148 = $7;
  $149 = ((($148)) + 8|0);
  $6 = $149;
  $150 = $6;
  $5 = $150;
  $151 = $5;
  $152 = $120;
  $9 = $1;
  $153 = $9;
  $8 = $153;
  $154 = $8;
  $155 = HEAP32[$154>>2]|0;
  $156 = ((($155)) + 16|0);
  $13 = $151;
  $14 = $152;
  $15 = $156;
  $157 = $13;
  $158 = $14;
  $159 = $15;
  $10 = $157;
  $11 = $158;
  $12 = $159;
  $160 = $11;
  $161 = HEAP32[$160>>2]|0;
  $162 = $12;
  $163 = HEAP32[$162>>2]|0;
  $164 = ($161|0)<($163|0);
  if (!($164)) {
   $48 = $130;
   $238 = $48;
   $239 = ((($238)) + 8|0);
   $47 = $239;
   $240 = $47;
   $46 = $240;
   $241 = $46;
   $50 = $1;
   $242 = $50;
   $49 = $242;
   $243 = $49;
   $244 = HEAP32[$243>>2]|0;
   $245 = ((($244)) + 16|0);
   $246 = $120;
   $54 = $241;
   $55 = $245;
   $56 = $246;
   $247 = $54;
   $248 = $55;
   $249 = $56;
   $51 = $247;
   $52 = $248;
   $53 = $249;
   $250 = $52;
   $251 = HEAP32[$250>>2]|0;
   $252 = $53;
   $253 = HEAP32[$252>>2]|0;
   $254 = ($251|0)<($253|0);
   if (!($254)) {
    $379 = HEAP32[$1>>2]|0;
    $380 = $118;
    HEAP32[$380>>2] = $379;
    $381 = HEAP32[$1>>2]|0;
    $382 = $119;
    HEAP32[$382>>2] = $381;
    $383 = $119;
    $116 = $383;
    $384 = $116;
    STACKTOP = sp;return ($384|0);
   }
   ;HEAP32[$127>>2]=HEAP32[$1>>2]|0;
   ;HEAP8[$79>>0]=HEAP8[$127>>0]|0;HEAP8[$79+1>>0]=HEAP8[$127+1>>0]|0;HEAP8[$79+2>>0]=HEAP8[$127+2>>0]|0;HEAP8[$79+3>>0]=HEAP8[$127+3>>0]|0;
   $78 = 1;
   $255 = $78;
   $74 = $79;
   $75 = $255;
   $256 = $74;
   $257 = $75;
   ;HEAP8[$73>>0]=HEAP8[$76>>0]|0;
   $71 = $256;
   $72 = $257;
   $258 = $72;
   $259 = ($258|0)>=(0);
   L8: do {
    if ($259) {
     while(1) {
      $260 = $72;
      $261 = ($260|0)>(0);
      if (!($261)) {
       break L8;
      }
      $262 = $71;
      $70 = $262;
      $263 = $70;
      $264 = HEAP32[$263>>2]|0;
      $69 = $264;
      $265 = $69;
      $266 = ((($265)) + 4|0);
      $267 = HEAP32[$266>>2]|0;
      $268 = ($267|0)!=(0|0);
      if ($268) {
       $269 = $69;
       $270 = ((($269)) + 4|0);
       $271 = HEAP32[$270>>2]|0;
       $67 = $271;
       while(1) {
        $272 = $67;
        $273 = HEAP32[$272>>2]|0;
        $274 = ($273|0)!=(0|0);
        $275 = $67;
        if (!($274)) {
         break;
        }
        $276 = HEAP32[$275>>2]|0;
        $67 = $276;
       }
       $68 = $275;
      } else {
       while(1) {
        $277 = $69;
        $66 = $277;
        $278 = $66;
        $279 = $66;
        $280 = ((($279)) + 8|0);
        $281 = HEAP32[$280>>2]|0;
        $282 = HEAP32[$281>>2]|0;
        $283 = ($278|0)==($282|0);
        $284 = $283 ^ 1;
        $285 = $69;
        if (!($284)) {
         break;
        }
        $65 = $285;
        $286 = $65;
        $287 = ((($286)) + 8|0);
        $288 = HEAP32[$287>>2]|0;
        $69 = $288;
       }
       $289 = ((($285)) + 8|0);
       $290 = HEAP32[$289>>2]|0;
       $68 = $290;
      }
      $291 = $68;
      HEAP32[$263>>2] = $291;
      $292 = $72;
      $293 = (($292) + -1)|0;
      $72 = $293;
     }
    } else {
     while(1) {
      $294 = $72;
      $295 = ($294|0)<(0);
      if (!($295)) {
       break L8;
      }
      $296 = $71;
      $64 = $296;
      $297 = $64;
      $298 = HEAP32[$297>>2]|0;
      $62 = $298;
      $299 = $62;
      $300 = HEAP32[$299>>2]|0;
      $301 = ($300|0)!=(0|0);
      $302 = $62;
      if ($301) {
       $303 = HEAP32[$302>>2]|0;
       $60 = $303;
       while(1) {
        $304 = $60;
        $305 = ((($304)) + 4|0);
        $306 = HEAP32[$305>>2]|0;
        $307 = ($306|0)!=(0|0);
        $308 = $60;
        if (!($307)) {
         break;
        }
        $309 = ((($308)) + 4|0);
        $310 = HEAP32[$309>>2]|0;
        $60 = $310;
       }
       $61 = $308;
      } else {
       $63 = $302;
       while(1) {
        $311 = $63;
        $59 = $311;
        $312 = $59;
        $313 = $59;
        $314 = ((($313)) + 8|0);
        $315 = HEAP32[$314>>2]|0;
        $316 = HEAP32[$315>>2]|0;
        $317 = ($312|0)==($316|0);
        $318 = $63;
        if (!($317)) {
         break;
        }
        $57 = $318;
        $319 = $57;
        $320 = ((($319)) + 8|0);
        $321 = HEAP32[$320>>2]|0;
        $63 = $321;
       }
       $58 = $318;
       $322 = $58;
       $323 = ((($322)) + 8|0);
       $324 = HEAP32[$323>>2]|0;
       $61 = $324;
      }
      $325 = $61;
      HEAP32[$297>>2] = $325;
      $326 = $72;
      $327 = (($326) + 1)|0;
      $72 = $327;
     }
    }
   } while(0);
   ;HEAP32[$77>>2]=HEAP32[$79>>2]|0;
   $328 = HEAP32[$77>>2]|0;
   HEAP32[$126>>2] = $328;
   $88 = $130;
   $329 = $88;
   $86 = $329;
   $330 = $86;
   $331 = ((($330)) + 4|0);
   $85 = $331;
   $332 = $85;
   $84 = $332;
   $333 = $84;
   $83 = $333;
   $334 = $83;
   $82 = $334;
   $335 = $82;
   $80 = $87;
   $81 = $335;
   $336 = $80;
   $337 = $81;
   HEAP32[$336>>2] = $337;
   $338 = HEAP32[$87>>2]|0;
   HEAP32[$129>>2] = $338;
   ;HEAP8[$90>>0]=HEAP8[$129>>0]|0;HEAP8[$90+1>>0]=HEAP8[$129+1>>0]|0;HEAP8[$90+2>>0]=HEAP8[$129+2>>0]|0;HEAP8[$90+3>>0]=HEAP8[$129+3>>0]|0;
   $89 = $128;
   $339 = $89;
   $340 = HEAP32[$90>>2]|0;
   HEAP32[$339>>2] = $340;
   $91 = $126;
   $92 = $128;
   $341 = $91;
   $342 = HEAP32[$341>>2]|0;
   $343 = $92;
   $344 = HEAP32[$343>>2]|0;
   $345 = ($342|0)==($344|0);
   if (!($345)) {
    $95 = $130;
    $346 = $95;
    $347 = ((($346)) + 8|0);
    $94 = $347;
    $348 = $94;
    $93 = $348;
    $349 = $93;
    $350 = $120;
    $97 = $126;
    $351 = $97;
    $96 = $351;
    $352 = $96;
    $353 = HEAP32[$352>>2]|0;
    $354 = ((($353)) + 16|0);
    $101 = $349;
    $102 = $350;
    $103 = $354;
    $355 = $101;
    $356 = $102;
    $357 = $103;
    $98 = $355;
    $99 = $356;
    $100 = $357;
    $358 = $99;
    $359 = HEAP32[$358>>2]|0;
    $360 = $100;
    $361 = HEAP32[$360>>2]|0;
    $362 = ($359|0)<($361|0);
    if (!($362)) {
     $376 = $118;
     $377 = $120;
     $378 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEERPNS_15__tree_end_nodeISI_EERKT_($130,$376,$377)|0);
     $116 = $378;
     $384 = $116;
     STACKTOP = sp;return ($384|0);
    }
   }
   $104 = $1;
   $363 = $104;
   $364 = HEAP32[$363>>2]|0;
   $365 = ((($364)) + 4|0);
   $366 = HEAP32[$365>>2]|0;
   $367 = ($366|0)==(0|0);
   if ($367) {
    $368 = HEAP32[$1>>2]|0;
    $369 = $118;
    HEAP32[$369>>2] = $368;
    $370 = HEAP32[$1>>2]|0;
    $371 = ((($370)) + 4|0);
    $116 = $371;
    $384 = $116;
    STACKTOP = sp;return ($384|0);
   } else {
    $372 = HEAP32[$126>>2]|0;
    $373 = $118;
    HEAP32[$373>>2] = $372;
    $374 = $118;
    $375 = HEAP32[$374>>2]|0;
    $116 = $375;
    $384 = $116;
    STACKTOP = sp;return ($384|0);
   }
  }
 }
 ;HEAP32[$123>>2]=HEAP32[$1>>2]|0;
 $20 = $130;
 $165 = $20;
 $18 = $165;
 $166 = $18;
 $167 = HEAP32[$166>>2]|0;
 $16 = $19;
 $17 = $167;
 $168 = $16;
 $169 = $17;
 HEAP32[$168>>2] = $169;
 $170 = HEAP32[$19>>2]|0;
 HEAP32[$125>>2] = $170;
 ;HEAP8[$22>>0]=HEAP8[$125>>0]|0;HEAP8[$22+1>>0]=HEAP8[$125+1>>0]|0;HEAP8[$22+2>>0]=HEAP8[$125+2>>0]|0;HEAP8[$22+3>>0]=HEAP8[$125+3>>0]|0;
 $21 = $124;
 $171 = $21;
 $172 = HEAP32[$22>>2]|0;
 HEAP32[$171>>2] = $172;
 $23 = $123;
 $24 = $124;
 $173 = $23;
 $174 = HEAP32[$173>>2]|0;
 $175 = $24;
 $176 = HEAP32[$175>>2]|0;
 $177 = ($174|0)==($176|0);
 if (!($177)) {
  $27 = $130;
  $178 = $27;
  $179 = ((($178)) + 8|0);
  $26 = $179;
  $180 = $26;
  $25 = $180;
  $181 = $25;
  $35 = $123;
  $182 = $35;
  $183 = HEAP32[$182>>2]|0;
  $33 = $183;
  $184 = $33;
  $185 = HEAP32[$184>>2]|0;
  $186 = ($185|0)!=(0|0);
  $187 = $33;
  if ($186) {
   $188 = HEAP32[$187>>2]|0;
   $31 = $188;
   while(1) {
    $189 = $31;
    $190 = ((($189)) + 4|0);
    $191 = HEAP32[$190>>2]|0;
    $192 = ($191|0)!=(0|0);
    $193 = $31;
    if (!($192)) {
     break;
    }
    $194 = ((($193)) + 4|0);
    $195 = HEAP32[$194>>2]|0;
    $31 = $195;
   }
   $32 = $193;
  } else {
   $34 = $187;
   while(1) {
    $196 = $34;
    $30 = $196;
    $197 = $30;
    $198 = $30;
    $199 = ((($198)) + 8|0);
    $200 = HEAP32[$199>>2]|0;
    $201 = HEAP32[$200>>2]|0;
    $202 = ($197|0)==($201|0);
    $203 = $34;
    if (!($202)) {
     break;
    }
    $28 = $203;
    $204 = $28;
    $205 = ((($204)) + 8|0);
    $206 = HEAP32[$205>>2]|0;
    $34 = $206;
   }
   $29 = $203;
   $207 = $29;
   $208 = ((($207)) + 8|0);
   $209 = HEAP32[$208>>2]|0;
   $32 = $209;
  }
  $210 = $32;
  HEAP32[$182>>2] = $210;
  $37 = $182;
  $211 = $37;
  $36 = $211;
  $212 = $36;
  $213 = HEAP32[$212>>2]|0;
  $214 = ((($213)) + 16|0);
  $215 = $120;
  $41 = $181;
  $42 = $214;
  $43 = $215;
  $216 = $41;
  $217 = $42;
  $218 = $43;
  $38 = $216;
  $39 = $217;
  $40 = $218;
  $219 = $39;
  $220 = HEAP32[$219>>2]|0;
  $221 = $40;
  $222 = HEAP32[$221>>2]|0;
  $223 = ($220|0)<($222|0);
  if (!($223)) {
   $235 = $118;
   $236 = $120;
   $237 = (__ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE12__find_equalIiEERPNS_16__tree_node_baseIPvEERPNS_15__tree_end_nodeISI_EERKT_($130,$235,$236)|0);
   $116 = $237;
   $384 = $116;
   STACKTOP = sp;return ($384|0);
  }
 }
 $224 = HEAP32[$1>>2]|0;
 $225 = HEAP32[$224>>2]|0;
 $226 = ($225|0)==(0|0);
 if ($226) {
  $227 = HEAP32[$1>>2]|0;
  $228 = $118;
  HEAP32[$228>>2] = $227;
  $229 = $118;
  $230 = HEAP32[$229>>2]|0;
  $116 = $230;
  $384 = $116;
  STACKTOP = sp;return ($384|0);
 } else {
  $231 = HEAP32[$123>>2]|0;
  $232 = $118;
  HEAP32[$232>>2] = $231;
  $233 = HEAP32[$123>>2]|0;
  $234 = ((($233)) + 4|0);
  $116 = $234;
  $384 = $116;
  STACKTOP = sp;return ($384|0);
 }
 return (0)|0;
}
function __ZNSt3__26__treeINS_12__value_typeIiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEENS_19__map_value_compareIiS8_NS3_IiEELb1EEENS5_IS8_EEE16__construct_nodeIJRKNS_4pairIKiS7_EEEEENS_10unique_ptrINS_11__tree_nodeIS8_PvEENS_22__tree_node_destructorINS5_ISN_EEEEEEDpOT_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0;
 var $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0;
 var $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0;
 var $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0;
 var $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0;
 var $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 352|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(352|0);
 $14 = sp + 8|0;
 $19 = sp + 343|0;
 $39 = sp + 200|0;
 $67 = sp;
 $70 = sp + 341|0;
 $87 = sp + 340|0;
 $88 = sp + 16|0;
 $84 = $1;
 $85 = $2;
 $89 = $84;
 $83 = $89;
 $90 = $83;
 $91 = ((($90)) + 4|0);
 $82 = $91;
 $92 = $82;
 $81 = $92;
 $93 = $81;
 $86 = $93;
 $$expand_i1_val = 0;
 HEAP8[$87>>0] = $$expand_i1_val;
 $94 = $86;
 $52 = $94;
 $53 = 1;
 $95 = $52;
 $96 = $53;
 $49 = $95;
 $50 = $96;
 $51 = 0;
 $97 = $49;
 $98 = $50;
 $48 = $97;
 $99 = ($98>>>0)>(134217727);
 if ($99) {
  $46 = 3928;
  $100 = (___cxa_allocate_exception(8)|0);
  $101 = $46;
  $44 = $100;
  $45 = $101;
  $102 = $44;
  $103 = $45;
  __ZNSt11logic_errorC2EPKc($102,$103);
  HEAP32[$102>>2] = (3644);
  ___cxa_throw(($100|0),(2792|0),(18|0));
  // unreachable;
 }
 $104 = $50;
 $105 = $104<<5;
 $47 = $105;
 $106 = $47;
 $107 = (__Znwm($106)|0);
 $108 = $86;
 $41 = $88;
 $42 = $108;
 $43 = 0;
 $109 = $41;
 $110 = $42;
 HEAP32[$109>>2] = $110;
 $111 = ((($109)) + 4|0);
 $112 = $43;
 $113 = $112&1;
 $114 = $113&1;
 HEAP8[$111>>0] = $114;
 $38 = $0;
 HEAP32[$39>>2] = $107;
 $40 = $88;
 $115 = $38;
 $116 = $40;
 $37 = $116;
 $117 = $37;
 $34 = $115;
 $35 = $39;
 $36 = $117;
 $118 = $34;
 $119 = $35;
 $33 = $119;
 $120 = $33;
 $27 = $118;
 $28 = $120;
 $121 = $27;
 $122 = $28;
 $26 = $122;
 $123 = $26;
 $124 = HEAP32[$123>>2]|0;
 HEAP32[$121>>2] = $124;
 $125 = ((($118)) + 4|0);
 $126 = $36;
 $29 = $126;
 $127 = $29;
 $31 = $125;
 $32 = $127;
 $128 = $31;
 $129 = $32;
 $30 = $129;
 $130 = $30;
 ;HEAP32[$128>>2]=HEAP32[$130>>2]|0;HEAP32[$128+4>>2]=HEAP32[$130+4>>2]|0;
 $131 = $86;
 $25 = $0;
 $132 = $25;
 $24 = $132;
 $133 = $24;
 $23 = $133;
 $134 = $23;
 $135 = HEAP32[$134>>2]|0;
 $136 = ((($135)) + 16|0);
 $22 = $136;
 $137 = $22;
 $21 = $137;
 $138 = $21;
 $139 = $85;
 $20 = $139;
 $140 = $20;
 $16 = $131;
 $17 = $138;
 $18 = $140;
 $141 = $16;
 $142 = $17;
 $143 = $18;
 $15 = $143;
 $144 = $15;
 ;HEAP8[$14>>0]=HEAP8[$19>>0]|0;
 $11 = $141;
 $12 = $142;
 $13 = $144;
 $145 = $11;
 $146 = $12;
 $147 = $13;
 $10 = $147;
 $148 = $10;
 $7 = $145;
 $8 = $146;
 $9 = $148;
 $149 = $8;
 $150 = $9;
 $6 = $150;
 $151 = $6;
 __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEC2ERKS8_($149,$151);
 $5 = $0;
 $152 = $5;
 $4 = $152;
 $153 = $4;
 $154 = ((($153)) + 4|0);
 $3 = $154;
 $155 = $3;
 $156 = ((($155)) + 4|0);
 HEAP8[$156>>0] = 1;
 $$expand_i1_val2 = 1;
 HEAP8[$87>>0] = $$expand_i1_val2;
 $$pre_trunc = HEAP8[$87>>0]|0;
 $157 = $$pre_trunc&1;
 if ($157) {
  STACKTOP = sp;return;
 }
 $80 = $0;
 $158 = $80;
 $77 = $158;
 $78 = 0;
 $159 = $77;
 $76 = $159;
 $160 = $76;
 $75 = $160;
 $161 = $75;
 $162 = HEAP32[$161>>2]|0;
 $79 = $162;
 $163 = $78;
 $57 = $159;
 $164 = $57;
 $56 = $164;
 $165 = $56;
 HEAP32[$165>>2] = $163;
 $166 = $79;
 $167 = ($166|0)!=(0|0);
 if (!($167)) {
  STACKTOP = sp;return;
 }
 $55 = $159;
 $168 = $55;
 $169 = ((($168)) + 4|0);
 $54 = $169;
 $170 = $54;
 $171 = $79;
 $73 = $170;
 $74 = $171;
 $172 = $73;
 $173 = ((($172)) + 4|0);
 $174 = HEAP8[$173>>0]|0;
 $175 = $174&1;
 if ($175) {
  $176 = HEAP32[$172>>2]|0;
  $177 = $74;
  $178 = ((($177)) + 16|0);
  $72 = $178;
  $179 = $72;
  $71 = $179;
  $180 = $71;
  $68 = $176;
  $69 = $180;
  $181 = $68;
  $182 = $69;
  ;HEAP8[$67>>0]=HEAP8[$70>>0]|0;
  $65 = $181;
  $66 = $182;
  $183 = $66;
  __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEED2Ev($183);
 }
 $184 = $74;
 $185 = ($184|0)!=(0|0);
 if (!($185)) {
  STACKTOP = sp;return;
 }
 $186 = HEAP32[$172>>2]|0;
 $187 = $74;
 $62 = $186;
 $63 = $187;
 $64 = 1;
 $188 = $62;
 $189 = $63;
 $190 = $64;
 $59 = $188;
 $60 = $189;
 $61 = $190;
 $191 = $60;
 $58 = $191;
 $192 = $58;
 __ZdlPv($192);
 STACKTOP = sp;return;
}
function __ZNSt3__24pairIKiNS_8multisetIcNS_4lessIcEENS_9allocatorIcEEEEEC2ERKS8_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$byval_copy = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0;
 var $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0;
 var $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0;
 var $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0;
 var $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0;
 var $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 320|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(320|0);
 $$byval_copy = sp + 304|0;
 $5 = sp + 288|0;
 $7 = sp + 280|0;
 $16 = sp + 244|0;
 $18 = sp + 236|0;
 $21 = sp + 24|0;
 $23 = sp + 311|0;
 $31 = sp + 192|0;
 $34 = sp + 180|0;
 $35 = sp + 16|0;
 $49 = sp + 124|0;
 $51 = sp + 116|0;
 $53 = sp + 108|0;
 $56 = sp + 96|0;
 $57 = sp + 92|0;
 $58 = sp + 88|0;
 $59 = sp + 8|0;
 $60 = sp;
 $66 = sp + 310|0;
 $73 = sp + 309|0;
 $74 = sp + 308|0;
 $75 = sp + 40|0;
 $76 = sp + 36|0;
 $77 = $0;
 $78 = $1;
 $79 = $77;
 $80 = $78;
 $81 = HEAP32[$80>>2]|0;
 HEAP32[$79>>2] = $81;
 $82 = ((($79)) + 4|0);
 $83 = $78;
 $84 = ((($83)) + 4|0);
 $71 = $82;
 $72 = $84;
 $85 = $71;
 $86 = $72;
 $70 = $86;
 $87 = $70;
 $88 = ((($87)) + 8|0);
 $69 = $88;
 $89 = $69;
 $68 = $89;
 $90 = $68;
 $91 = $72;
 $67 = $91;
 $92 = $67;
 $65 = $92;
 $93 = $65;
 $94 = ((($93)) + 4|0);
 $64 = $94;
 $95 = $64;
 $63 = $95;
 $96 = $63;
 $61 = $66;
 $62 = $96;
 $22 = $74;
 $97 = $22;
 ;HEAP8[$21>>0]=HEAP8[$23>>0]|0;
 $20 = $97;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEEC2ERKS2_RKS4_($85,$90,$73);
 $98 = $72;
 $8 = $98;
 $99 = $8;
 $6 = $99;
 $100 = $6;
 $4 = $100;
 $101 = $4;
 $102 = HEAP32[$101>>2]|0;
 $2 = $5;
 $3 = $102;
 $103 = $2;
 $104 = $3;
 HEAP32[$103>>2] = $104;
 $105 = HEAP32[$5>>2]|0;
 HEAP32[$7>>2] = $105;
 $106 = HEAP32[$7>>2]|0;
 HEAP32[$75>>2] = $106;
 $107 = $72;
 $19 = $107;
 $108 = $19;
 $17 = $108;
 $109 = $17;
 $15 = $109;
 $110 = $15;
 $111 = ((($110)) + 4|0);
 $14 = $111;
 $112 = $14;
 $13 = $112;
 $113 = $13;
 $12 = $113;
 $114 = $12;
 $11 = $114;
 $115 = $11;
 $9 = $16;
 $10 = $115;
 $116 = $9;
 $117 = $10;
 HEAP32[$116>>2] = $117;
 $118 = HEAP32[$16>>2]|0;
 HEAP32[$18>>2] = $118;
 $119 = HEAP32[$18>>2]|0;
 HEAP32[$76>>2] = $119;
 ;HEAP8[$59>>0]=HEAP8[$76>>0]|0;HEAP8[$59+1>>0]=HEAP8[$76+1>>0]|0;HEAP8[$59+2>>0]=HEAP8[$76+2>>0]|0;HEAP8[$59+3>>0]=HEAP8[$76+3>>0]|0;
 ;HEAP8[$60>>0]=HEAP8[$75>>0]|0;HEAP8[$60+1>>0]=HEAP8[$75+1>>0]|0;HEAP8[$60+2>>0]=HEAP8[$75+2>>0]|0;HEAP8[$60+3>>0]=HEAP8[$75+3>>0]|0;
 $55 = $85;
 $120 = $55;
 $54 = $120;
 $121 = $54;
 $52 = $121;
 $122 = $52;
 $50 = $122;
 $123 = $50;
 $48 = $123;
 $124 = $48;
 $125 = ((($124)) + 4|0);
 $47 = $125;
 $126 = $47;
 $46 = $126;
 $127 = $46;
 $45 = $127;
 $128 = $45;
 $44 = $128;
 $129 = $44;
 $42 = $49;
 $43 = $129;
 $130 = $42;
 $131 = $43;
 HEAP32[$130>>2] = $131;
 $132 = HEAP32[$49>>2]|0;
 HEAP32[$51>>2] = $132;
 $133 = HEAP32[$51>>2]|0;
 HEAP32[$53>>2] = $133;
 $134 = HEAP32[$53>>2]|0;
 HEAP32[$56>>2] = $134;
 while(1) {
  $28 = $60;
  $29 = $59;
  $135 = $28;
  $136 = $29;
  $26 = $135;
  $27 = $136;
  $137 = $26;
  $138 = HEAP32[$137>>2]|0;
  $139 = $27;
  $140 = HEAP32[$139>>2]|0;
  $141 = ($138|0)==($140|0);
  $142 = $141 ^ 1;
  if (!($142)) {
   break;
  }
  ;HEAP32[$57>>2]=HEAP32[$56>>2]|0;
  $25 = $60;
  $143 = $25;
  $24 = $143;
  $144 = $24;
  $145 = HEAP32[$144>>2]|0;
  $146 = ((($145)) + 13|0);
  ;HEAP8[$35>>0]=HEAP8[$57>>0]|0;HEAP8[$35+1>>0]=HEAP8[$57+1>>0]|0;HEAP8[$35+2>>0]=HEAP8[$57+2>>0]|0;HEAP8[$35+3>>0]=HEAP8[$57+3>>0]|0;
  $32 = $120;
  $33 = $146;
  $147 = $32;
  ;HEAP32[$34>>2]=HEAP32[$35>>2]|0;
  $148 = $33;
  $30 = $148;
  $149 = $30;
  ;HEAP32[$$byval_copy>>2]=HEAP32[$34>>2]|0;
  $150 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE20__emplace_hint_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEENS_21__tree_const_iteratorIcSD_lEEDpOT_($147,$$byval_copy,$149)|0);
  HEAP32[$31>>2] = $150;
  $151 = HEAP32[$31>>2]|0;
  HEAP32[$58>>2] = $151;
  $41 = $60;
  $152 = $41;
  $153 = HEAP32[$152>>2]|0;
  $40 = $153;
  $154 = $40;
  $155 = ((($154)) + 4|0);
  $156 = HEAP32[$155>>2]|0;
  $157 = ($156|0)!=(0|0);
  if ($157) {
   $158 = $40;
   $159 = ((($158)) + 4|0);
   $160 = HEAP32[$159>>2]|0;
   $38 = $160;
   while(1) {
    $161 = $38;
    $162 = HEAP32[$161>>2]|0;
    $163 = ($162|0)!=(0|0);
    $164 = $38;
    if (!($163)) {
     break;
    }
    $165 = HEAP32[$164>>2]|0;
    $38 = $165;
   }
   $39 = $164;
  } else {
   while(1) {
    $166 = $40;
    $37 = $166;
    $167 = $37;
    $168 = $37;
    $169 = ((($168)) + 8|0);
    $170 = HEAP32[$169>>2]|0;
    $171 = HEAP32[$170>>2]|0;
    $172 = ($167|0)==($171|0);
    $173 = $172 ^ 1;
    $174 = $40;
    if (!($173)) {
     break;
    }
    $36 = $174;
    $175 = $36;
    $176 = ((($175)) + 8|0);
    $177 = HEAP32[$176>>2]|0;
    $40 = $177;
   }
   $178 = ((($174)) + 8|0);
   $179 = HEAP32[$178>>2]|0;
   $39 = $179;
  }
  $180 = $39;
  HEAP32[$152>>2] = $180;
 }
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEEC2ERKS2_RKS4_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 144|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(144|0);
 $11 = sp;
 $34 = sp + 129|0;
 $35 = sp + 128|0;
 $36 = sp + 4|0;
 $31 = $0;
 $32 = $1;
 $33 = $2;
 $37 = $31;
 HEAP32[$37>>2] = 0;
 $38 = ((($37)) + 4|0);
 $39 = $33;
 $29 = $35;
 $30 = $39;
 ;HEAP8[$11>>0]=HEAP8[$34>>0]|0;
 $9 = $38;
 $10 = $35;
 $40 = $9;
 $8 = $40;
 $41 = $8;
 $7 = $41;
 $42 = $7;
 HEAP32[$42>>2] = 0;
 $43 = $10;
 $3 = $43;
 $44 = $3;
 $5 = $40;
 $6 = $44;
 $45 = $6;
 $4 = $45;
 $46 = ((($37)) + 8|0);
 HEAP32[$36>>2] = 0;
 $47 = $32;
 $20 = $46;
 $21 = $36;
 $22 = $47;
 $48 = $20;
 $49 = $21;
 $19 = $49;
 $50 = $19;
 $13 = $48;
 $14 = $50;
 $51 = $13;
 $52 = $14;
 $12 = $52;
 $53 = $12;
 $54 = HEAP32[$53>>2]|0;
 HEAP32[$51>>2] = $54;
 $55 = $22;
 $15 = $55;
 $56 = $15;
 $17 = $48;
 $18 = $56;
 $57 = $18;
 $16 = $57;
 $27 = $37;
 $58 = $27;
 $59 = ((($58)) + 4|0);
 $26 = $59;
 $60 = $26;
 $25 = $60;
 $61 = $25;
 $24 = $61;
 $62 = $24;
 $23 = $62;
 $63 = $23;
 $28 = $37;
 $64 = $28;
 HEAP32[$64>>2] = $63;
 STACKTOP = sp;return;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE20__emplace_hint_multiIJRKcEEENS_15__tree_iteratorIcPNS_11__tree_nodeIcPvEElEENS_21__tree_const_iteratorIcSD_lEEDpOT_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$byval_copy = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0;
 var $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
 var $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0;
 var $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0;
 var $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0;
 var $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(224|0);
 $$byval_copy = sp + 204|0;
 $28 = sp;
 $31 = sp + 208|0;
 $46 = sp + 36|0;
 $49 = sp + 16|0;
 $50 = sp + 12|0;
 $52 = sp + 4|0;
 $47 = $0;
 $48 = $2;
 $53 = $47;
 $54 = $48;
 $45 = $54;
 $55 = $45;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__construct_nodeIJRKcEEENS_10unique_ptrINS_11__tree_nodeIcPvEENS_22__tree_node_destructorINS3_ISC_EEEEEEDpOT_($49,$53,$55);
 ;HEAP32[$52>>2]=HEAP32[$1>>2]|0;
 $44 = $49;
 $56 = $44;
 $43 = $56;
 $57 = $43;
 $42 = $57;
 $58 = $42;
 $59 = HEAP32[$58>>2]|0;
 $60 = ((($59)) + 13|0);
 $14 = $60;
 $61 = $14;
 ;HEAP32[$$byval_copy>>2]=HEAP32[$52>>2]|0;
 $62 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE11__find_leafENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIS8_EEEERKc($53,$$byval_copy,$50,$61)|0);
 $51 = $62;
 $63 = HEAP32[$50>>2]|0;
 $64 = $51;
 $5 = $49;
 $65 = $5;
 $4 = $65;
 $66 = $4;
 $3 = $66;
 $67 = $3;
 $68 = HEAP32[$67>>2]|0;
 __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__insert_node_atEPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERSA_SA_($53,$63,$64,$68);
 $10 = $49;
 $69 = $10;
 $9 = $69;
 $70 = $9;
 $8 = $70;
 $71 = $8;
 $72 = HEAP32[$71>>2]|0;
 $11 = $72;
 $7 = $69;
 $73 = $7;
 $6 = $73;
 $74 = $6;
 HEAP32[$74>>2] = 0;
 $75 = $11;
 $12 = $46;
 $13 = $75;
 $76 = $12;
 $77 = $13;
 HEAP32[$76>>2] = $77;
 $41 = $49;
 $78 = $41;
 $38 = $78;
 $39 = 0;
 $79 = $38;
 $37 = $79;
 $80 = $37;
 $36 = $80;
 $81 = $36;
 $82 = HEAP32[$81>>2]|0;
 $40 = $82;
 $83 = $39;
 $18 = $79;
 $84 = $18;
 $17 = $84;
 $85 = $17;
 HEAP32[$85>>2] = $83;
 $86 = $40;
 $87 = ($86|0)!=(0|0);
 if (!($87)) {
  $112 = HEAP32[$46>>2]|0;
  STACKTOP = sp;return ($112|0);
 }
 $16 = $79;
 $88 = $16;
 $89 = ((($88)) + 4|0);
 $15 = $89;
 $90 = $15;
 $91 = $40;
 $34 = $90;
 $35 = $91;
 $92 = $34;
 $93 = ((($92)) + 4|0);
 $94 = HEAP8[$93>>0]|0;
 $95 = $94&1;
 if ($95) {
  $96 = HEAP32[$92>>2]|0;
  $97 = $35;
  $98 = ((($97)) + 13|0);
  $33 = $98;
  $99 = $33;
  $32 = $99;
  $100 = $32;
  $29 = $96;
  $30 = $100;
  $101 = $29;
  $102 = $30;
  ;HEAP8[$28>>0]=HEAP8[$31>>0]|0;
  $26 = $101;
  $27 = $102;
 }
 $103 = $35;
 $104 = ($103|0)!=(0|0);
 if (!($104)) {
  $112 = HEAP32[$46>>2]|0;
  STACKTOP = sp;return ($112|0);
 }
 $105 = HEAP32[$92>>2]|0;
 $106 = $35;
 $23 = $105;
 $24 = $106;
 $25 = 1;
 $107 = $23;
 $108 = $24;
 $109 = $25;
 $20 = $107;
 $21 = $108;
 $22 = $109;
 $110 = $21;
 $19 = $110;
 $111 = $19;
 __ZdlPv($111);
 $112 = HEAP32[$46>>2]|0;
 STACKTOP = sp;return ($112|0);
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE11__find_leafENS_21__tree_const_iteratorIcPNS_11__tree_nodeIcPvEElEERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIS8_EEEERKc($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $18 = 0;
 var $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0;
 var $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0;
 var $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0;
 var $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0;
 var $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(224|0);
 $15 = sp + 176|0;
 $18 = sp + 8|0;
 $40 = sp;
 $48 = sp + 52|0;
 $54 = sp + 28|0;
 $55 = sp + 24|0;
 $56 = sp + 20|0;
 $57 = sp + 16|0;
 $58 = sp + 12|0;
 $51 = $0;
 $52 = $2;
 $53 = $3;
 $59 = $51;
 $49 = $59;
 $60 = $49;
 $47 = $60;
 $61 = $47;
 $62 = ((($61)) + 4|0);
 $46 = $62;
 $63 = $46;
 $45 = $63;
 $64 = $45;
 $44 = $64;
 $65 = $44;
 $43 = $65;
 $66 = $43;
 $41 = $48;
 $42 = $66;
 $67 = $41;
 $68 = $42;
 HEAP32[$67>>2] = $68;
 $69 = HEAP32[$48>>2]|0;
 HEAP32[$55>>2] = $69;
 ;HEAP8[$40>>0]=HEAP8[$55>>0]|0;HEAP8[$40+1>>0]=HEAP8[$55+1>>0]|0;HEAP8[$40+2>>0]=HEAP8[$55+2>>0]|0;HEAP8[$40+3>>0]=HEAP8[$55+3>>0]|0;
 $39 = $54;
 $70 = $39;
 $71 = HEAP32[$40>>2]|0;
 HEAP32[$70>>2] = $71;
 $37 = $1;
 $38 = $54;
 $72 = $37;
 $73 = HEAP32[$72>>2]|0;
 $74 = $38;
 $75 = HEAP32[$74>>2]|0;
 $76 = ($73|0)==($75|0);
 if (!($76)) {
  $6 = $59;
  $77 = $6;
  $78 = ((($77)) + 8|0);
  $5 = $78;
  $79 = $5;
  $4 = $79;
  $80 = $4;
  $8 = $1;
  $81 = $8;
  $7 = $81;
  $82 = $7;
  $83 = HEAP32[$82>>2]|0;
  $84 = ((($83)) + 13|0);
  $85 = $53;
  $9 = $80;
  $10 = $84;
  $11 = $85;
  $86 = $10;
  $87 = HEAP8[$86>>0]|0;
  $88 = $87 << 24 >> 24;
  $89 = $11;
  $90 = HEAP8[$89>>0]|0;
  $91 = $90 << 24 >> 24;
  $92 = ($88|0)<($91|0);
  $93 = $92 ^ 1;
  if (!($93)) {
   $167 = $52;
   $168 = $53;
   $169 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__find_leaf_lowERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERKc($59,$167,$168)|0);
   $50 = $169;
   $170 = $50;
   STACKTOP = sp;return ($170|0);
  }
 }
 ;HEAP32[$56>>2]=HEAP32[$1>>2]|0;
 $16 = $59;
 $94 = $16;
 $14 = $94;
 $95 = $14;
 $96 = HEAP32[$95>>2]|0;
 $12 = $15;
 $13 = $96;
 $97 = $12;
 $98 = $13;
 HEAP32[$97>>2] = $98;
 $99 = HEAP32[$15>>2]|0;
 HEAP32[$58>>2] = $99;
 ;HEAP8[$18>>0]=HEAP8[$58>>0]|0;HEAP8[$18+1>>0]=HEAP8[$58+1>>0]|0;HEAP8[$18+2>>0]=HEAP8[$58+2>>0]|0;HEAP8[$18+3>>0]=HEAP8[$58+3>>0]|0;
 $17 = $57;
 $100 = $17;
 $101 = HEAP32[$18>>2]|0;
 HEAP32[$100>>2] = $101;
 $19 = $56;
 $20 = $57;
 $102 = $19;
 $103 = HEAP32[$102>>2]|0;
 $104 = $20;
 $105 = HEAP32[$104>>2]|0;
 $106 = ($103|0)==($105|0);
 if (!($106)) {
  $23 = $59;
  $107 = $23;
  $108 = ((($107)) + 8|0);
  $22 = $108;
  $109 = $22;
  $21 = $109;
  $110 = $21;
  $111 = $53;
  $31 = $56;
  $112 = $31;
  $113 = HEAP32[$112>>2]|0;
  $29 = $113;
  $114 = $29;
  $115 = HEAP32[$114>>2]|0;
  $116 = ($115|0)!=(0|0);
  $117 = $29;
  if ($116) {
   $118 = HEAP32[$117>>2]|0;
   $27 = $118;
   while(1) {
    $119 = $27;
    $120 = ((($119)) + 4|0);
    $121 = HEAP32[$120>>2]|0;
    $122 = ($121|0)!=(0|0);
    $123 = $27;
    if (!($122)) {
     break;
    }
    $124 = ((($123)) + 4|0);
    $125 = HEAP32[$124>>2]|0;
    $27 = $125;
   }
   $28 = $123;
  } else {
   $30 = $117;
   while(1) {
    $126 = $30;
    $26 = $126;
    $127 = $26;
    $128 = $26;
    $129 = ((($128)) + 8|0);
    $130 = HEAP32[$129>>2]|0;
    $131 = HEAP32[$130>>2]|0;
    $132 = ($127|0)==($131|0);
    $133 = $30;
    if (!($132)) {
     break;
    }
    $24 = $133;
    $134 = $24;
    $135 = ((($134)) + 8|0);
    $136 = HEAP32[$135>>2]|0;
    $30 = $136;
   }
   $25 = $133;
   $137 = $25;
   $138 = ((($137)) + 8|0);
   $139 = HEAP32[$138>>2]|0;
   $28 = $139;
  }
  $140 = $28;
  HEAP32[$112>>2] = $140;
  $33 = $112;
  $141 = $33;
  $32 = $141;
  $142 = $32;
  $143 = HEAP32[$142>>2]|0;
  $144 = ((($143)) + 13|0);
  $34 = $110;
  $35 = $111;
  $36 = $144;
  $145 = $35;
  $146 = HEAP8[$145>>0]|0;
  $147 = $146 << 24 >> 24;
  $148 = $36;
  $149 = HEAP8[$148>>0]|0;
  $150 = $149 << 24 >> 24;
  $151 = ($147|0)<($150|0);
  $152 = $151 ^ 1;
  if (!($152)) {
   $164 = $52;
   $165 = $53;
   $166 = (__ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE16__find_leaf_highERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERKc($59,$164,$165)|0);
   $50 = $166;
   $170 = $50;
   STACKTOP = sp;return ($170|0);
  }
 }
 $153 = HEAP32[$1>>2]|0;
 $154 = HEAP32[$153>>2]|0;
 $155 = ($154|0)==(0|0);
 if ($155) {
  $156 = HEAP32[$1>>2]|0;
  $157 = $52;
  HEAP32[$157>>2] = $156;
  $158 = $52;
  $159 = HEAP32[$158>>2]|0;
  $50 = $159;
  $170 = $50;
  STACKTOP = sp;return ($170|0);
 } else {
  $160 = HEAP32[$56>>2]|0;
  $161 = $52;
  HEAP32[$161>>2] = $160;
  $162 = HEAP32[$56>>2]|0;
  $163 = ((($162)) + 4|0);
  $50 = $163;
  $170 = $50;
  STACKTOP = sp;return ($170|0);
 }
 return (0)|0;
}
function __ZNSt3__26__treeIcNS_4lessIcEENS_9allocatorIcEEE15__find_leaf_lowERPNS_15__tree_end_nodeIPNS_16__tree_node_baseIPvEEEERKc($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $21 = $0;
 $22 = $1;
 $23 = $2;
 $25 = $21;
 $19 = $25;
 $26 = $19;
 $18 = $26;
 $27 = $18;
 $28 = ((($27)) + 4|0);
 $17 = $28;
 $29 = $17;
 $16 = $29;
 $30 = $16;
 $15 = $30;
 $31 = $15;
 $14 = $31;
 $32 = $14;
 $33 = HEAP32[$32>>2]|0;
 $24 = $33;
 $34 = $24;
 $35 = ($34|0)!=(0|0);
 if (!($35)) {
  $13 = $25;
  $67 = $13;
  $68 = ((($67)) + 4|0);
  $12 = $68;
  $69 = $12;
  $11 = $69;
  $70 = $11;
  $10 = $70;
  $71 = $10;
  $9 = $71;
  $72 = $9;
  $73 = $22;
  HEAP32[$73>>2] = $72;
  $74 = $22;
  $75 = HEAP32[$74>>2]|0;
  $20 = $75;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 while(1) {
  $5 = $25;
  $36 = $5;
  $37 = ((($36)) + 8|0);
  $4 = $37;
  $38 = $4;
  $3 = $38;
  $39 = $3;
  $40 = $24;
  $41 = ((($40)) + 13|0);
  $42 = $23;
  $6 = $39;
  $7 = $41;
  $8 = $42;
  $43 = $7;
  $44 = HEAP8[$43>>0]|0;
  $45 = $44 << 24 >> 24;
  $46 = $8;
  $47 = HEAP8[$46>>0]|0;
  $48 = $47 << 24 >> 24;
  $49 = ($45|0)<($48|0);
  $50 = $24;
  if ($49) {
   $51 = ((($50)) + 4|0);
   $52 = HEAP32[$51>>2]|0;
   $53 = ($52|0)!=(0|0);
   $54 = $24;
   if (!($53)) {
    label = 6;
    break;
   }
   $55 = ((($54)) + 4|0);
   $56 = HEAP32[$55>>2]|0;
   $24 = $56;
  } else {
   $60 = HEAP32[$50>>2]|0;
   $61 = ($60|0)!=(0|0);
   $62 = $24;
   if (!($61)) {
    label = 9;
    break;
   }
   $63 = HEAP32[$62>>2]|0;
   $24 = $63;
  }
 }
 if ((label|0) == 6) {
  $57 = $22;
  HEAP32[$57>>2] = $54;
  $58 = $24;
  $59 = ((($58)) + 4|0);
  $20 = $59;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 else if ((label|0) == 9) {
  $64 = $22;
  HEAP32[$64>>2] = $62;
  $65 = $22;
  $66 = HEAP32[$65>>2]|0;
  $20 = $66;
  $76 = $20;
  STACKTOP = sp;return ($76|0);
 }
 return (0)|0;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8allocateEm($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $12 = 0, $13 = 0;
 var $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0;
 var $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0;
 var $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0;
 var $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0;
 var $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 176|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(176|0);
 $43 = $0;
 $44 = $1;
 $45 = $43;
 $46 = $44;
 $47 = (__ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8max_sizeEv($45)|0);
 $48 = ($46>>>0)>($47>>>0);
 if ($48) {
  __ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv($45);
  // unreachable;
 }
 $42 = $45;
 $49 = $42;
 $50 = ((($49)) + 8|0);
 $41 = $50;
 $51 = $41;
 $40 = $51;
 $52 = $40;
 $53 = $44;
 $10 = $52;
 $11 = $53;
 $54 = $10;
 $55 = $11;
 $7 = $54;
 $8 = $55;
 $9 = 0;
 $56 = $7;
 $57 = $8;
 $6 = $56;
 $58 = ($57>>>0)>(357913941);
 if ($58) {
  $4 = 3928;
  $59 = (___cxa_allocate_exception(8)|0);
  $60 = $4;
  $2 = $59;
  $3 = $60;
  $61 = $2;
  $62 = $3;
  __ZNSt11logic_errorC2EPKc($61,$62);
  HEAP32[$61>>2] = (3644);
  ___cxa_throw(($59|0),(2792|0),(18|0));
  // unreachable;
 } else {
  $63 = $8;
  $64 = ($63*12)|0;
  $5 = $64;
  $65 = $5;
  $66 = (__Znwm($65)|0);
  $67 = ((($45)) + 4|0);
  HEAP32[$67>>2] = $66;
  HEAP32[$45>>2] = $66;
  $68 = HEAP32[$45>>2]|0;
  $69 = $44;
  $70 = (($68) + (($69*12)|0)|0);
  $14 = $45;
  $71 = $14;
  $72 = ((($71)) + 8|0);
  $13 = $72;
  $73 = $13;
  $12 = $73;
  $74 = $12;
  HEAP32[$74>>2] = $70;
  $38 = $45;
  $39 = 0;
  $75 = $38;
  $37 = $75;
  $76 = $37;
  $77 = HEAP32[$76>>2]|0;
  $36 = $77;
  $78 = $36;
  $16 = $75;
  $79 = $16;
  $80 = HEAP32[$79>>2]|0;
  $15 = $80;
  $81 = $15;
  $21 = $75;
  $82 = $21;
  $20 = $82;
  $83 = $20;
  $19 = $83;
  $84 = $19;
  $85 = ((($84)) + 8|0);
  $18 = $85;
  $86 = $18;
  $17 = $86;
  $87 = $17;
  $88 = HEAP32[$87>>2]|0;
  $89 = HEAP32[$83>>2]|0;
  $90 = $88;
  $91 = $89;
  $92 = (($90) - ($91))|0;
  $93 = (($92|0) / 12)&-1;
  $94 = (($81) + (($93*12)|0)|0);
  $23 = $75;
  $95 = $23;
  $96 = HEAP32[$95>>2]|0;
  $22 = $96;
  $97 = $22;
  $28 = $75;
  $98 = $28;
  $27 = $98;
  $99 = $27;
  $26 = $99;
  $100 = $26;
  $101 = ((($100)) + 8|0);
  $25 = $101;
  $102 = $25;
  $24 = $102;
  $103 = $24;
  $104 = HEAP32[$103>>2]|0;
  $105 = HEAP32[$99>>2]|0;
  $106 = $104;
  $107 = $105;
  $108 = (($106) - ($107))|0;
  $109 = (($108|0) / 12)&-1;
  $110 = (($97) + (($109*12)|0)|0);
  $30 = $75;
  $111 = $30;
  $112 = HEAP32[$111>>2]|0;
  $29 = $112;
  $113 = $29;
  $114 = $39;
  $115 = (($113) + (($114*12)|0)|0);
  $31 = $75;
  $32 = $78;
  $33 = $94;
  $34 = $110;
  $35 = $115;
  STACKTOP = sp;return;
 }
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endINS_15__list_iteratorIS6_PvEEEENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESE_SE_m($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 176|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(176|0);
 $21 = sp + 16|0;
 $26 = sp + 169|0;
 $34 = sp + 8|0;
 $35 = sp;
 $43 = sp + 168|0;
 $44 = sp + 24|0;
 $45 = sp + 20|0;
 $40 = $0;
 $41 = $3;
 $46 = $40;
 $39 = $46;
 $47 = $39;
 $48 = ((($47)) + 8|0);
 $38 = $48;
 $49 = $38;
 $37 = $49;
 $50 = $37;
 $42 = $50;
 $51 = $41;
 $4 = $43;
 $5 = $46;
 $6 = $51;
 $52 = $42;
 ;HEAP32[$44>>2]=HEAP32[$1>>2]|0;
 ;HEAP32[$45>>2]=HEAP32[$2>>2]|0;
 $53 = ((($46)) + 4|0);
 ;HEAP8[$34>>0]=HEAP8[$45>>0]|0;HEAP8[$34+1>>0]=HEAP8[$45+1>>0]|0;HEAP8[$34+2>>0]=HEAP8[$45+2>>0]|0;HEAP8[$34+3>>0]=HEAP8[$45+3>>0]|0;
 ;HEAP8[$35>>0]=HEAP8[$44>>0]|0;HEAP8[$35+1>>0]=HEAP8[$44+1>>0]|0;HEAP8[$35+2>>0]=HEAP8[$44+2>>0]|0;HEAP8[$35+3>>0]=HEAP8[$44+3>>0]|0;
 $32 = $52;
 $33 = $53;
 while(1) {
  $30 = $35;
  $31 = $34;
  $54 = $30;
  $55 = $31;
  $28 = $54;
  $29 = $55;
  $56 = $28;
  $57 = HEAP32[$56>>2]|0;
  $58 = $29;
  $59 = HEAP32[$58>>2]|0;
  $60 = ($57|0)==($59|0);
  $61 = $60 ^ 1;
  if (!($61)) {
   break;
  }
  $62 = $32;
  $63 = $33;
  $64 = HEAP32[$63>>2]|0;
  $12 = $64;
  $65 = $12;
  $11 = $35;
  $66 = $11;
  $67 = HEAP32[$66>>2]|0;
  $10 = $67;
  $68 = $10;
  $9 = $68;
  $69 = $9;
  $8 = $69;
  $70 = $8;
  $7 = $70;
  $71 = $7;
  $72 = ((($71)) + 8|0);
  $23 = $62;
  $24 = $65;
  $25 = $72;
  $73 = $23;
  $74 = $24;
  $75 = $25;
  $22 = $75;
  $76 = $22;
  ;HEAP8[$21>>0]=HEAP8[$26>>0]|0;
  $18 = $73;
  $19 = $74;
  $20 = $76;
  $77 = $18;
  $78 = $19;
  $79 = $20;
  $17 = $79;
  $80 = $17;
  $14 = $77;
  $15 = $78;
  $16 = $80;
  $81 = $15;
  $82 = $16;
  $13 = $82;
  $83 = $13;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($81,$83);
  $27 = $35;
  $84 = $27;
  $85 = HEAP32[$84>>2]|0;
  $86 = ((($85)) + 4|0);
  $87 = HEAP32[$86>>2]|0;
  HEAP32[$84>>2] = $87;
  $88 = $33;
  $89 = HEAP32[$88>>2]|0;
  $90 = ((($89)) + 12|0);
  HEAP32[$88>>2] = $90;
 }
 $36 = $43;
 STACKTOP = sp;return;
}
function __ZNSt3__213__vector_baseINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $19 = sp;
 $22 = sp + 120|0;
 $31 = $0;
 $32 = $31;
 $33 = HEAP32[$32>>2]|0;
 $34 = ($33|0)!=(0|0);
 if (!($34)) {
  STACKTOP = sp;return;
 }
 $30 = $32;
 $35 = $30;
 $36 = HEAP32[$35>>2]|0;
 $27 = $35;
 $28 = $36;
 $37 = $27;
 $38 = ((($37)) + 4|0);
 $39 = HEAP32[$38>>2]|0;
 $29 = $39;
 while(1) {
  $40 = $28;
  $41 = $29;
  $42 = ($40|0)!=($41|0);
  if (!($42)) {
   break;
  }
  $26 = $37;
  $43 = $26;
  $44 = ((($43)) + 8|0);
  $25 = $44;
  $45 = $25;
  $24 = $45;
  $46 = $24;
  $47 = $29;
  $48 = ((($47)) + -12|0);
  $29 = $48;
  $23 = $48;
  $49 = $23;
  $20 = $46;
  $21 = $49;
  $50 = $20;
  $51 = $21;
  ;HEAP8[$19>>0]=HEAP8[$22>>0]|0;
  $17 = $50;
  $18 = $51;
  $52 = $17;
  $53 = $18;
  $15 = $52;
  $16 = $53;
  $54 = $16;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($54);
 }
 $55 = $28;
 $56 = ((($37)) + 4|0);
 HEAP32[$56>>2] = $55;
 $14 = $32;
 $57 = $14;
 $58 = ((($57)) + 8|0);
 $13 = $58;
 $59 = $13;
 $12 = $59;
 $60 = $12;
 $61 = HEAP32[$32>>2]|0;
 $4 = $32;
 $62 = $4;
 $3 = $62;
 $63 = $3;
 $64 = ((($63)) + 8|0);
 $2 = $64;
 $65 = $2;
 $1 = $65;
 $66 = $1;
 $67 = HEAP32[$66>>2]|0;
 $68 = HEAP32[$62>>2]|0;
 $69 = $67;
 $70 = $68;
 $71 = (($69) - ($70))|0;
 $72 = (($71|0) / 12)&-1;
 $9 = $60;
 $10 = $61;
 $11 = $72;
 $73 = $9;
 $74 = $10;
 $75 = $11;
 $6 = $73;
 $7 = $74;
 $8 = $75;
 $76 = $7;
 $5 = $76;
 $77 = $5;
 __ZdlPv($77);
 STACKTOP = sp;return;
}
function __ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8max_sizeEv($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 80|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(80|0);
 $6 = sp + 8|0;
 $9 = sp + 77|0;
 $12 = sp;
 $14 = sp + 76|0;
 $19 = sp + 16|0;
 $20 = sp + 12|0;
 $18 = $0;
 $21 = $18;
 $17 = $21;
 $22 = $17;
 $23 = ((($22)) + 8|0);
 $16 = $23;
 $24 = $16;
 $15 = $24;
 $25 = $15;
 $13 = $25;
 $26 = $13;
 ;HEAP8[$12>>0]=HEAP8[$14>>0]|0;
 $11 = $26;
 $27 = $11;
 $10 = $27;
 HEAP32[$19>>2] = 357913941;
 HEAP32[$20>>2] = 2147483647;
 $7 = $19;
 $8 = $20;
 $28 = $7;
 $29 = $8;
 ;HEAP8[$6>>0]=HEAP8[$9>>0]|0;
 $4 = $28;
 $5 = $29;
 $30 = $5;
 $31 = $4;
 $1 = $6;
 $2 = $30;
 $3 = $31;
 $32 = $2;
 $33 = HEAP32[$32>>2]|0;
 $34 = $3;
 $35 = HEAP32[$34>>2]|0;
 $36 = ($33>>>0)<($35>>>0);
 $37 = $5;
 $38 = $4;
 $39 = $36 ? $37 : $38;
 $40 = HEAP32[$39>>2]|0;
 STACKTOP = sp;return ($40|0);
}
function __ZN10emscripten8internal7InvokerI14StrategyResultJNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEcEE6invokeEPFS2_S9_cEPNS0_11BindingTypeIS9_EUt_Ec($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $6 = sp + 16|0;
 $7 = sp;
 $3 = $0;
 $4 = $1;
 $5 = $2;
 $8 = $3;
 $9 = $4;
 __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE12fromWireTypeEPNS9_Ut_E($7,$9);
 $10 = $5;
 $11 = (__ZN10emscripten8internal11BindingTypeIcE12fromWireTypeEc($10)|0);
 FUNCTION_TABLE_viii[$8 & 63]($6,$7,$11);
 $12 = (__ZN10emscripten8internal18GenericBindingTypeI14StrategyResultE10toWireTypeEOS2_($6)|0);
 __ZN14StrategyResultD2Ev($6);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($7);
 STACKTOP = sp;return ($12|0);
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJ14StrategyResultNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEcEE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 3;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJ14StrategyResultNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEcEE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJ14StrategyResultNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEcEEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal18GenericBindingTypeI14StrategyResultE10toWireTypeEOS2_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = (__Znwm(16)|0);
 $4 = $2;
 $1 = $4;
 $5 = $1;
 __ZN14StrategyResultC2EOS_($3,$5);
 STACKTOP = sp;return ($3|0);
}
function __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE12fromWireTypeEPNS9_Ut_E($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $9 = $1;
 $10 = $9;
 $11 = ((($10)) + 4|0);
 $12 = $9;
 $13 = HEAP32[$12>>2]|0;
 $6 = $0;
 $7 = $11;
 $8 = $13;
 $14 = $6;
 $5 = $14;
 $15 = $5;
 $4 = $15;
 $16 = $4;
 ;HEAP32[$16>>2]=0|0;HEAP32[$16+4>>2]=0|0;HEAP32[$16+8>>2]=0|0;
 $3 = $15;
 $17 = $3;
 $2 = $17;
 $18 = $7;
 $19 = $8;
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($14,$18,$19);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal11BindingTypeIcE12fromWireTypeEc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN14StrategyResultD2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ((($2)) + 4|0);
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($3);
 STACKTOP = sp;return;
}
function __ZN14StrategyResultC2EOS_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0;
 var $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $16 = sp + 68|0;
 $32 = $0;
 $33 = $1;
 $34 = $32;
 $35 = $33;
 $36 = HEAP32[$35>>2]|0;
 HEAP32[$34>>2] = $36;
 $37 = ((($34)) + 4|0);
 $38 = $33;
 $39 = ((($38)) + 4|0);
 $30 = $37;
 $31 = $39;
 $40 = $30;
 $41 = $31;
 $29 = $41;
 $42 = $29;
 $43 = ((($42)) + 8|0);
 $28 = $43;
 $44 = $28;
 $27 = $44;
 $45 = $27;
 $26 = $45;
 $46 = $26;
 $14 = $40;
 $15 = $46;
 $47 = $14;
 $13 = $47;
 HEAP32[$47>>2] = 0;
 $48 = ((($47)) + 4|0);
 HEAP32[$48>>2] = 0;
 $49 = ((($47)) + 8|0);
 HEAP32[$16>>2] = 0;
 $50 = $15;
 $10 = $49;
 $11 = $16;
 $12 = $50;
 $51 = $10;
 $52 = $11;
 $9 = $52;
 $53 = $9;
 $3 = $51;
 $4 = $53;
 $54 = $3;
 $55 = $4;
 $2 = $55;
 HEAP32[$54>>2] = 0;
 $56 = $12;
 $5 = $56;
 $57 = $5;
 $7 = $51;
 $8 = $57;
 $58 = $8;
 $6 = $58;
 $59 = $31;
 $60 = HEAP32[$59>>2]|0;
 HEAP32[$40>>2] = $60;
 $61 = $31;
 $62 = ((($61)) + 4|0);
 $63 = HEAP32[$62>>2]|0;
 $64 = ((($40)) + 4|0);
 HEAP32[$64>>2] = $63;
 $65 = $31;
 $19 = $65;
 $66 = $19;
 $67 = ((($66)) + 8|0);
 $18 = $67;
 $68 = $18;
 $17 = $68;
 $69 = $17;
 $70 = HEAP32[$69>>2]|0;
 $22 = $40;
 $71 = $22;
 $72 = ((($71)) + 8|0);
 $21 = $72;
 $73 = $21;
 $20 = $73;
 $74 = $20;
 HEAP32[$74>>2] = $70;
 $75 = $31;
 $25 = $75;
 $76 = $25;
 $77 = ((($76)) + 8|0);
 $24 = $77;
 $78 = $24;
 $23 = $78;
 $79 = $23;
 HEAP32[$79>>2] = 0;
 $80 = $31;
 $81 = ((($80)) + 4|0);
 HEAP32[$81>>2] = 0;
 $82 = $31;
 HEAP32[$82>>2] = 0;
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 __ZNSt3__213__vector_baseINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($2);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJ14StrategyResultNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEcEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2984|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJiiiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4114|0);
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE9push_backERKS6_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 112|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(112|0);
 $14 = sp;
 $19 = sp + 105|0;
 $29 = sp + 104|0;
 $27 = $0;
 $28 = $1;
 $30 = $27;
 $31 = ((($30)) + 4|0);
 $32 = HEAP32[$31>>2]|0;
 $26 = $30;
 $33 = $26;
 $34 = ((($33)) + 8|0);
 $25 = $34;
 $35 = $25;
 $24 = $35;
 $36 = $24;
 $37 = HEAP32[$36>>2]|0;
 $38 = ($32|0)!=($37|0);
 if ($38) {
  $21 = $29;
  $22 = $30;
  $23 = 1;
  $5 = $30;
  $39 = $5;
  $40 = ((($39)) + 8|0);
  $4 = $40;
  $41 = $4;
  $3 = $41;
  $42 = $3;
  $43 = ((($30)) + 4|0);
  $44 = HEAP32[$43>>2]|0;
  $2 = $44;
  $45 = $2;
  $46 = $28;
  $16 = $42;
  $17 = $45;
  $18 = $46;
  $47 = $16;
  $48 = $17;
  $49 = $18;
  $15 = $49;
  $50 = $15;
  ;HEAP8[$14>>0]=HEAP8[$19>>0]|0;
  $11 = $47;
  $12 = $48;
  $13 = $50;
  $51 = $11;
  $52 = $12;
  $53 = $13;
  $10 = $53;
  $54 = $10;
  $7 = $51;
  $8 = $52;
  $9 = $54;
  $55 = $8;
  $56 = $9;
  $6 = $56;
  $57 = $6;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($55,$57);
  $20 = $29;
  $58 = ((($30)) + 4|0);
  $59 = HEAP32[$58>>2]|0;
  $60 = ((($59)) + 12|0);
  HEAP32[$58>>2] = $60;
  STACKTOP = sp;return;
 } else {
  $61 = $28;
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE21__push_back_slow_pathIRKS6_EEvOT_($30,$61);
  STACKTOP = sp;return;
 }
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6resizeEmRKS6_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0;
 var $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0;
 var $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 192|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(192|0);
 $7 = sp;
 $10 = sp + 184|0;
 $46 = $0;
 $47 = $1;
 $48 = $2;
 $50 = $46;
 $45 = $50;
 $51 = $45;
 $52 = ((($51)) + 4|0);
 $53 = HEAP32[$52>>2]|0;
 $54 = HEAP32[$51>>2]|0;
 $55 = $53;
 $56 = $54;
 $57 = (($55) - ($56))|0;
 $58 = (($57|0) / 12)&-1;
 $49 = $58;
 $59 = $49;
 $60 = $47;
 $61 = ($59>>>0)<($60>>>0);
 if ($61) {
  $62 = $47;
  $63 = $49;
  $64 = (($62) - ($63))|0;
  $65 = $48;
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8__appendEmRKS6_($50,$64,$65);
  STACKTOP = sp;return;
 }
 $66 = $49;
 $67 = $47;
 $68 = ($66>>>0)>($67>>>0);
 if (!($68)) {
  STACKTOP = sp;return;
 }
 $69 = HEAP32[$50>>2]|0;
 $70 = $47;
 $71 = (($69) + (($70*12)|0)|0);
 $42 = $50;
 $43 = $71;
 $72 = $42;
 $73 = $43;
 $40 = $72;
 $41 = $73;
 $39 = $72;
 $74 = $39;
 $75 = ((($74)) + 4|0);
 $76 = HEAP32[$75>>2]|0;
 $77 = HEAP32[$74>>2]|0;
 $78 = $76;
 $79 = $77;
 $80 = (($78) - ($79))|0;
 $81 = (($80|0) / 12)&-1;
 $44 = $81;
 $82 = $43;
 $15 = $72;
 $16 = $82;
 $83 = $15;
 $84 = ((($83)) + 4|0);
 $85 = HEAP32[$84>>2]|0;
 $17 = $85;
 while(1) {
  $86 = $16;
  $87 = $17;
  $88 = ($86|0)!=($87|0);
  if (!($88)) {
   break;
  }
  $14 = $83;
  $89 = $14;
  $90 = ((($89)) + 8|0);
  $13 = $90;
  $91 = $13;
  $12 = $91;
  $92 = $12;
  $93 = $17;
  $94 = ((($93)) + -12|0);
  $17 = $94;
  $11 = $94;
  $95 = $11;
  $8 = $92;
  $9 = $95;
  $96 = $8;
  $97 = $9;
  ;HEAP8[$7>>0]=HEAP8[$10>>0]|0;
  $5 = $96;
  $6 = $97;
  $98 = $5;
  $99 = $6;
  $3 = $98;
  $4 = $99;
  $100 = $4;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($100);
 }
 $101 = $16;
 $102 = ((($83)) + 4|0);
 HEAP32[$102>>2] = $101;
 $103 = $44;
 $37 = $72;
 $38 = $103;
 $104 = $37;
 $36 = $104;
 $105 = $36;
 $106 = HEAP32[$105>>2]|0;
 $35 = $106;
 $107 = $35;
 $19 = $104;
 $108 = $19;
 $109 = HEAP32[$108>>2]|0;
 $18 = $109;
 $110 = $18;
 $24 = $104;
 $111 = $24;
 $23 = $111;
 $112 = $23;
 $22 = $112;
 $113 = $22;
 $114 = ((($113)) + 8|0);
 $21 = $114;
 $115 = $21;
 $20 = $115;
 $116 = $20;
 $117 = HEAP32[$116>>2]|0;
 $118 = HEAP32[$112>>2]|0;
 $119 = $117;
 $120 = $118;
 $121 = (($119) - ($120))|0;
 $122 = (($121|0) / 12)&-1;
 $123 = (($110) + (($122*12)|0)|0);
 $26 = $104;
 $124 = $26;
 $125 = HEAP32[$124>>2]|0;
 $25 = $125;
 $126 = $25;
 $127 = $38;
 $128 = (($126) + (($127*12)|0)|0);
 $28 = $104;
 $129 = $28;
 $130 = HEAP32[$129>>2]|0;
 $27 = $130;
 $131 = $27;
 $29 = $104;
 $132 = $29;
 $133 = ((($132)) + 4|0);
 $134 = HEAP32[$133>>2]|0;
 $135 = HEAP32[$132>>2]|0;
 $136 = $134;
 $137 = $135;
 $138 = (($136) - ($137))|0;
 $139 = (($138|0) / 12)&-1;
 $140 = (($131) + (($139*12)|0)|0);
 $30 = $104;
 $31 = $107;
 $32 = $123;
 $33 = $128;
 $34 = $140;
 STACKTOP = sp;return;
}
function __ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE4sizeEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ((($2)) + 4|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = HEAP32[$2>>2]|0;
 $6 = $4;
 $7 = $5;
 $8 = (($6) - ($7))|0;
 $9 = (($8|0) / 12)&-1;
 STACKTOP = sp;return ($9|0);
}
function __ZN10emscripten8internal12VectorAccessINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getERKSB_m($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $6 = $1;
 $7 = $2;
 $8 = $7;
 $9 = $6;
 $5 = $9;
 $10 = $5;
 $11 = ((($10)) + 4|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = HEAP32[$10>>2]|0;
 $14 = $12;
 $15 = $13;
 $16 = (($14) - ($15))|0;
 $17 = (($16|0) / 12)&-1;
 $18 = ($8>>>0)<($17>>>0);
 if ($18) {
  $19 = $6;
  $20 = $7;
  $3 = $19;
  $4 = $20;
  $21 = $3;
  $22 = HEAP32[$21>>2]|0;
  $23 = $4;
  $24 = (($22) + (($23*12)|0)|0);
  __ZN10emscripten3valC2IRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEOT_($0,$24);
  STACKTOP = sp;return;
 } else {
  __ZN10emscripten3val9undefinedEv($0);
  STACKTOP = sp;return;
 }
}
function __ZN10emscripten8internal12VectorAccessINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3setERSB_mRKS9_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $5 = $0;
 $6 = $1;
 $7 = $2;
 $8 = $7;
 $9 = $5;
 $10 = $6;
 $3 = $9;
 $4 = $10;
 $11 = $3;
 $12 = HEAP32[$11>>2]|0;
 $13 = $4;
 $14 = (($12) + (($13*12)|0)|0);
 (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEaSERKS5_($14,$8)|0);
 STACKTOP = sp;return 1;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE21__push_back_slow_pathIRKS6_EEvOT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0;
 var $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0;
 var $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0;
 var $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0;
 var $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 208|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(208|0);
 $10 = sp + 8|0;
 $15 = sp + 193|0;
 $24 = sp;
 $27 = sp + 192|0;
 $35 = sp + 72|0;
 $38 = sp + 60|0;
 $46 = sp + 12|0;
 $43 = $0;
 $44 = $1;
 $47 = $43;
 $42 = $47;
 $48 = $42;
 $49 = ((($48)) + 8|0);
 $41 = $49;
 $50 = $41;
 $40 = $50;
 $51 = $40;
 $45 = $51;
 $39 = $47;
 $52 = $39;
 $53 = ((($52)) + 4|0);
 $54 = HEAP32[$53>>2]|0;
 $55 = HEAP32[$52>>2]|0;
 $56 = $54;
 $57 = $55;
 $58 = (($56) - ($57))|0;
 $59 = (($58|0) / 12)&-1;
 $60 = (($59) + 1)|0;
 $34 = $47;
 HEAP32[$35>>2] = $60;
 $61 = $34;
 $62 = (__ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8max_sizeEv($61)|0);
 $36 = $62;
 $63 = HEAP32[$35>>2]|0;
 $64 = $36;
 $65 = ($63>>>0)>($64>>>0);
 if ($65) {
  __ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv($61);
  // unreachable;
 }
 $32 = $61;
 $66 = $32;
 $31 = $66;
 $67 = $31;
 $30 = $67;
 $68 = $30;
 $69 = ((($68)) + 8|0);
 $29 = $69;
 $70 = $29;
 $28 = $70;
 $71 = $28;
 $72 = HEAP32[$71>>2]|0;
 $73 = HEAP32[$67>>2]|0;
 $74 = $72;
 $75 = $73;
 $76 = (($74) - ($75))|0;
 $77 = (($76|0) / 12)&-1;
 $37 = $77;
 $78 = $37;
 $79 = $36;
 $80 = (($79>>>0) / 2)&-1;
 $81 = ($78>>>0)>=($80>>>0);
 if ($81) {
  $82 = $36;
  $33 = $82;
 } else {
  $83 = $37;
  $84 = $83<<1;
  HEAP32[$38>>2] = $84;
  $25 = $38;
  $26 = $35;
  $85 = $25;
  $86 = $26;
  ;HEAP8[$24>>0]=HEAP8[$27>>0]|0;
  $22 = $85;
  $23 = $86;
  $87 = $22;
  $88 = $23;
  $19 = $24;
  $20 = $87;
  $21 = $88;
  $89 = $20;
  $90 = HEAP32[$89>>2]|0;
  $91 = $21;
  $92 = HEAP32[$91>>2]|0;
  $93 = ($90>>>0)<($92>>>0);
  $94 = $23;
  $95 = $22;
  $96 = $93 ? $94 : $95;
  $97 = HEAP32[$96>>2]|0;
  $33 = $97;
 }
 $98 = $33;
 $18 = $47;
 $99 = $18;
 $100 = ((($99)) + 4|0);
 $101 = HEAP32[$100>>2]|0;
 $102 = HEAP32[$99>>2]|0;
 $103 = $101;
 $104 = $102;
 $105 = (($103) - ($104))|0;
 $106 = (($105|0) / 12)&-1;
 $107 = $45;
 __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEEC2EmmS8_($46,$98,$106,$107);
 $108 = $45;
 $109 = ((($46)) + 8|0);
 $110 = HEAP32[$109>>2]|0;
 $17 = $110;
 $111 = $17;
 $112 = $44;
 $16 = $112;
 $113 = $16;
 $12 = $108;
 $13 = $111;
 $14 = $113;
 $114 = $12;
 $115 = $13;
 $116 = $14;
 $11 = $116;
 $117 = $11;
 ;HEAP8[$10>>0]=HEAP8[$15>>0]|0;
 $7 = $114;
 $8 = $115;
 $9 = $117;
 $118 = $7;
 $119 = $8;
 $120 = $9;
 $6 = $120;
 $121 = $6;
 $3 = $118;
 $4 = $119;
 $5 = $121;
 $122 = $4;
 $123 = $5;
 $2 = $123;
 $124 = $2;
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($122,$124);
 $125 = ((($46)) + 8|0);
 $126 = HEAP32[$125>>2]|0;
 $127 = ((($126)) + 12|0);
 HEAP32[$125>>2] = $127;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS6_RS7_EE($47,$46);
 __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEED2Ev($46);
 STACKTOP = sp;return;
}
function __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEEC2EmmS8_($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $35 = sp;
 $31 = $0;
 $32 = $1;
 $33 = $2;
 $34 = $3;
 $36 = $31;
 $37 = ((($36)) + 12|0);
 HEAP32[$35>>2] = 0;
 $38 = $34;
 $28 = $37;
 $29 = $35;
 $30 = $38;
 $39 = $28;
 $40 = $29;
 $27 = $40;
 $41 = $27;
 $21 = $39;
 $22 = $41;
 $42 = $21;
 $43 = $22;
 $20 = $43;
 HEAP32[$42>>2] = 0;
 $44 = ((($39)) + 4|0);
 $45 = $30;
 $23 = $45;
 $46 = $23;
 $25 = $44;
 $26 = $46;
 $47 = $25;
 $48 = $26;
 $24 = $48;
 $49 = $24;
 HEAP32[$47>>2] = $49;
 $50 = $32;
 $51 = ($50|0)!=(0);
 do {
  if ($51) {
   $6 = $36;
   $52 = $6;
   $53 = ((($52)) + 12|0);
   $5 = $53;
   $54 = $5;
   $55 = ((($54)) + 4|0);
   $4 = $55;
   $56 = $4;
   $57 = HEAP32[$56>>2]|0;
   $58 = $32;
   $15 = $57;
   $16 = $58;
   $59 = $15;
   $60 = $16;
   $12 = $59;
   $13 = $60;
   $14 = 0;
   $61 = $12;
   $62 = $13;
   $11 = $61;
   $63 = ($62>>>0)>(357913941);
   if ($63) {
    $9 = 3928;
    $64 = (___cxa_allocate_exception(8)|0);
    $65 = $9;
    $7 = $64;
    $8 = $65;
    $66 = $7;
    $67 = $8;
    __ZNSt11logic_errorC2EPKc($66,$67);
    HEAP32[$66>>2] = (3644);
    ___cxa_throw(($64|0),(2792|0),(18|0));
    // unreachable;
   } else {
    $68 = $13;
    $69 = ($68*12)|0;
    $10 = $69;
    $70 = $10;
    $71 = (__Znwm($70)|0);
    $72 = $71;
    break;
   }
  } else {
   $72 = 0;
  }
 } while(0);
 HEAP32[$36>>2] = $72;
 $73 = HEAP32[$36>>2]|0;
 $74 = $33;
 $75 = (($73) + (($74*12)|0)|0);
 $76 = ((($36)) + 8|0);
 HEAP32[$76>>2] = $75;
 $77 = ((($36)) + 4|0);
 HEAP32[$77>>2] = $75;
 $78 = HEAP32[$36>>2]|0;
 $79 = $32;
 $80 = (($78) + (($79*12)|0)|0);
 $19 = $36;
 $81 = $19;
 $82 = ((($81)) + 12|0);
 $18 = $82;
 $83 = $18;
 $17 = $83;
 $84 = $17;
 HEAP32[$84>>2] = $80;
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS6_RS7_EE($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0;
 var $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0;
 var $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0;
 var $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0;
 var $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0;
 var $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0;
 var $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0;
 var $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0;
 var $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 448|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(448|0);
 $23 = sp;
 $28 = sp + 436|0;
 $39 = sp + 292|0;
 $45 = sp + 268|0;
 $57 = sp + 220|0;
 $110 = $0;
 $111 = $1;
 $112 = $110;
 $109 = $112;
 $113 = $109;
 $108 = $113;
 $114 = $108;
 $115 = HEAP32[$114>>2]|0;
 $107 = $115;
 $116 = $107;
 $86 = $113;
 $117 = $86;
 $118 = HEAP32[$117>>2]|0;
 $85 = $118;
 $119 = $85;
 $91 = $113;
 $120 = $91;
 $90 = $120;
 $121 = $90;
 $89 = $121;
 $122 = $89;
 $123 = ((($122)) + 8|0);
 $88 = $123;
 $124 = $88;
 $87 = $124;
 $125 = $87;
 $126 = HEAP32[$125>>2]|0;
 $127 = HEAP32[$121>>2]|0;
 $128 = $126;
 $129 = $127;
 $130 = (($128) - ($129))|0;
 $131 = (($130|0) / 12)&-1;
 $132 = (($119) + (($131*12)|0)|0);
 $93 = $113;
 $133 = $93;
 $134 = HEAP32[$133>>2]|0;
 $92 = $134;
 $135 = $92;
 $94 = $113;
 $136 = $94;
 $137 = ((($136)) + 4|0);
 $138 = HEAP32[$137>>2]|0;
 $139 = HEAP32[$136>>2]|0;
 $140 = $138;
 $141 = $139;
 $142 = (($140) - ($141))|0;
 $143 = (($142|0) / 12)&-1;
 $144 = (($135) + (($143*12)|0)|0);
 $96 = $113;
 $145 = $96;
 $146 = HEAP32[$145>>2]|0;
 $95 = $146;
 $147 = $95;
 $101 = $113;
 $148 = $101;
 $100 = $148;
 $149 = $100;
 $99 = $149;
 $150 = $99;
 $151 = ((($150)) + 8|0);
 $98 = $151;
 $152 = $98;
 $97 = $152;
 $153 = $97;
 $154 = HEAP32[$153>>2]|0;
 $155 = HEAP32[$149>>2]|0;
 $156 = $154;
 $157 = $155;
 $158 = (($156) - ($157))|0;
 $159 = (($158|0) / 12)&-1;
 $160 = (($147) + (($159*12)|0)|0);
 $102 = $113;
 $103 = $116;
 $104 = $132;
 $105 = $144;
 $106 = $160;
 $4 = $112;
 $161 = $4;
 $162 = ((($161)) + 8|0);
 $3 = $162;
 $163 = $3;
 $2 = $163;
 $164 = $2;
 $165 = HEAP32[$112>>2]|0;
 $166 = ((($112)) + 4|0);
 $167 = HEAP32[$166>>2]|0;
 $168 = $111;
 $169 = ((($168)) + 4|0);
 $30 = $164;
 $31 = $165;
 $32 = $167;
 $33 = $169;
 while(1) {
  $170 = $32;
  $171 = $31;
  $172 = ($170|0)!=($171|0);
  if (!($172)) {
   break;
  }
  $173 = $30;
  $174 = $33;
  $175 = HEAP32[$174>>2]|0;
  $176 = ((($175)) + -12|0);
  $29 = $176;
  $177 = $29;
  $178 = $32;
  $179 = ((($178)) + -12|0);
  $32 = $179;
  $6 = $179;
  $180 = $6;
  $5 = $180;
  $181 = $5;
  $25 = $173;
  $26 = $177;
  $27 = $181;
  $182 = $25;
  $183 = $26;
  $184 = $27;
  $24 = $184;
  $185 = $24;
  ;HEAP8[$23>>0]=HEAP8[$28>>0]|0;
  $20 = $182;
  $21 = $183;
  $22 = $185;
  $186 = $20;
  $187 = $21;
  $188 = $22;
  $19 = $188;
  $189 = $19;
  $16 = $186;
  $17 = $187;
  $18 = $189;
  $190 = $17;
  $191 = $18;
  $15 = $191;
  $192 = $15;
  $13 = $190;
  $14 = $192;
  $193 = $13;
  $194 = $14;
  $12 = $194;
  $195 = $12;
  ;HEAP32[$193>>2]=HEAP32[$195>>2]|0;HEAP32[$193+4>>2]=HEAP32[$195+4>>2]|0;HEAP32[$193+8>>2]=HEAP32[$195+8>>2]|0;
  $196 = $14;
  $9 = $196;
  $197 = $9;
  $8 = $197;
  $198 = $8;
  $7 = $198;
  $199 = $7;
  $10 = $199;
  $11 = 0;
  while(1) {
   $200 = $11;
   $201 = ($200>>>0)<(3);
   if (!($201)) {
    break;
   }
   $202 = $10;
   $203 = $11;
   $204 = (($202) + ($203<<2)|0);
   HEAP32[$204>>2] = 0;
   $205 = $11;
   $206 = (($205) + 1)|0;
   $11 = $206;
  }
  $207 = $33;
  $208 = HEAP32[$207>>2]|0;
  $209 = ((($208)) + -12|0);
  HEAP32[$207>>2] = $209;
 }
 $210 = $111;
 $211 = ((($210)) + 4|0);
 $37 = $112;
 $38 = $211;
 $212 = $37;
 $36 = $212;
 $213 = $36;
 $214 = HEAP32[$213>>2]|0;
 HEAP32[$39>>2] = $214;
 $215 = $38;
 $34 = $215;
 $216 = $34;
 $217 = HEAP32[$216>>2]|0;
 $218 = $37;
 HEAP32[$218>>2] = $217;
 $35 = $39;
 $219 = $35;
 $220 = HEAP32[$219>>2]|0;
 $221 = $38;
 HEAP32[$221>>2] = $220;
 $222 = ((($112)) + 4|0);
 $223 = $111;
 $224 = ((($223)) + 8|0);
 $43 = $222;
 $44 = $224;
 $225 = $43;
 $42 = $225;
 $226 = $42;
 $227 = HEAP32[$226>>2]|0;
 HEAP32[$45>>2] = $227;
 $228 = $44;
 $40 = $228;
 $229 = $40;
 $230 = HEAP32[$229>>2]|0;
 $231 = $43;
 HEAP32[$231>>2] = $230;
 $41 = $45;
 $232 = $41;
 $233 = HEAP32[$232>>2]|0;
 $234 = $44;
 HEAP32[$234>>2] = $233;
 $48 = $112;
 $235 = $48;
 $236 = ((($235)) + 8|0);
 $47 = $236;
 $237 = $47;
 $46 = $237;
 $238 = $46;
 $239 = $111;
 $51 = $239;
 $240 = $51;
 $241 = ((($240)) + 12|0);
 $50 = $241;
 $242 = $50;
 $49 = $242;
 $243 = $49;
 $55 = $238;
 $56 = $243;
 $244 = $55;
 $54 = $244;
 $245 = $54;
 $246 = HEAP32[$245>>2]|0;
 HEAP32[$57>>2] = $246;
 $247 = $56;
 $52 = $247;
 $248 = $52;
 $249 = HEAP32[$248>>2]|0;
 $250 = $55;
 HEAP32[$250>>2] = $249;
 $53 = $57;
 $251 = $53;
 $252 = HEAP32[$251>>2]|0;
 $253 = $56;
 HEAP32[$253>>2] = $252;
 $254 = $111;
 $255 = ((($254)) + 4|0);
 $256 = HEAP32[$255>>2]|0;
 $257 = $111;
 HEAP32[$257>>2] = $256;
 $58 = $112;
 $258 = $58;
 $259 = ((($258)) + 4|0);
 $260 = HEAP32[$259>>2]|0;
 $261 = HEAP32[$258>>2]|0;
 $262 = $260;
 $263 = $261;
 $264 = (($262) - ($263))|0;
 $265 = (($264|0) / 12)&-1;
 $82 = $112;
 $83 = $265;
 $266 = $82;
 $81 = $266;
 $267 = $81;
 $268 = HEAP32[$267>>2]|0;
 $80 = $268;
 $269 = $80;
 $60 = $266;
 $270 = $60;
 $271 = HEAP32[$270>>2]|0;
 $59 = $271;
 $272 = $59;
 $65 = $266;
 $273 = $65;
 $64 = $273;
 $274 = $64;
 $63 = $274;
 $275 = $63;
 $276 = ((($275)) + 8|0);
 $62 = $276;
 $277 = $62;
 $61 = $277;
 $278 = $61;
 $279 = HEAP32[$278>>2]|0;
 $280 = HEAP32[$274>>2]|0;
 $281 = $279;
 $282 = $280;
 $283 = (($281) - ($282))|0;
 $284 = (($283|0) / 12)&-1;
 $285 = (($272) + (($284*12)|0)|0);
 $67 = $266;
 $286 = $67;
 $287 = HEAP32[$286>>2]|0;
 $66 = $287;
 $288 = $66;
 $72 = $266;
 $289 = $72;
 $71 = $289;
 $290 = $71;
 $70 = $290;
 $291 = $70;
 $292 = ((($291)) + 8|0);
 $69 = $292;
 $293 = $69;
 $68 = $293;
 $294 = $68;
 $295 = HEAP32[$294>>2]|0;
 $296 = HEAP32[$290>>2]|0;
 $297 = $295;
 $298 = $296;
 $299 = (($297) - ($298))|0;
 $300 = (($299|0) / 12)&-1;
 $301 = (($288) + (($300*12)|0)|0);
 $74 = $266;
 $302 = $74;
 $303 = HEAP32[$302>>2]|0;
 $73 = $303;
 $304 = $73;
 $305 = $83;
 $306 = (($304) + (($305*12)|0)|0);
 $75 = $266;
 $76 = $269;
 $77 = $285;
 $78 = $301;
 $79 = $306;
 $84 = $112;
 STACKTOP = sp;return;
}
function __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0;
 var $82 = 0, $83 = 0, $84 = 0, $85 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 144|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(144|0);
 $19 = sp + 8|0;
 $22 = sp + 133|0;
 $29 = sp;
 $32 = sp + 132|0;
 $34 = $0;
 $35 = $34;
 $33 = $35;
 $36 = $33;
 $37 = ((($36)) + 4|0);
 $38 = HEAP32[$37>>2]|0;
 $30 = $36;
 $31 = $38;
 $39 = $30;
 $40 = $31;
 ;HEAP8[$29>>0]=HEAP8[$32>>0]|0;
 $27 = $39;
 $28 = $40;
 $41 = $27;
 while(1) {
  $42 = $28;
  $43 = ((($41)) + 8|0);
  $44 = HEAP32[$43>>2]|0;
  $45 = ($42|0)!=($44|0);
  if (!($45)) {
   break;
  }
  $26 = $41;
  $46 = $26;
  $47 = ((($46)) + 12|0);
  $25 = $47;
  $48 = $25;
  $49 = ((($48)) + 4|0);
  $24 = $49;
  $50 = $24;
  $51 = HEAP32[$50>>2]|0;
  $52 = ((($41)) + 8|0);
  $53 = HEAP32[$52>>2]|0;
  $54 = ((($53)) + -12|0);
  HEAP32[$52>>2] = $54;
  $23 = $54;
  $55 = $23;
  $20 = $51;
  $21 = $55;
  $56 = $20;
  $57 = $21;
  ;HEAP8[$19>>0]=HEAP8[$22>>0]|0;
  $17 = $56;
  $18 = $57;
  $58 = $17;
  $59 = $18;
  $15 = $58;
  $16 = $59;
  $60 = $16;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($60);
 }
 $61 = HEAP32[$35>>2]|0;
 $62 = ($61|0)!=(0|0);
 if (!($62)) {
  STACKTOP = sp;return;
 }
 $14 = $35;
 $63 = $14;
 $64 = ((($63)) + 12|0);
 $13 = $64;
 $65 = $13;
 $66 = ((($65)) + 4|0);
 $12 = $66;
 $67 = $12;
 $68 = HEAP32[$67>>2]|0;
 $69 = HEAP32[$35>>2]|0;
 $11 = $35;
 $70 = $11;
 $10 = $70;
 $71 = $10;
 $72 = ((($71)) + 12|0);
 $9 = $72;
 $73 = $9;
 $8 = $73;
 $74 = $8;
 $75 = HEAP32[$74>>2]|0;
 $76 = HEAP32[$70>>2]|0;
 $77 = $75;
 $78 = $76;
 $79 = (($77) - ($78))|0;
 $80 = (($79|0) / 12)&-1;
 $5 = $68;
 $6 = $69;
 $7 = $80;
 $81 = $5;
 $82 = $6;
 $83 = $7;
 $2 = $81;
 $3 = $82;
 $4 = $83;
 $84 = $3;
 $1 = $84;
 $85 = $1;
 __ZdlPv($85);
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8__appendEmRKS6_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $18 = 0, $19 = 0;
 var $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0;
 var $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0;
 var $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0;
 var $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0;
 var $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 256|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(256|0);
 $9 = sp + 8|0;
 $12 = sp + 250|0;
 $20 = sp + 184|0;
 $23 = sp + 172|0;
 $40 = sp;
 $45 = sp + 249|0;
 $54 = sp + 248|0;
 $62 = sp + 12|0;
 $58 = $0;
 $59 = $1;
 $60 = $2;
 $63 = $58;
 $57 = $63;
 $64 = $57;
 $65 = ((($64)) + 8|0);
 $56 = $65;
 $66 = $56;
 $55 = $66;
 $67 = $55;
 $68 = HEAP32[$67>>2]|0;
 $69 = ((($63)) + 4|0);
 $70 = HEAP32[$69>>2]|0;
 $71 = $68;
 $72 = $70;
 $73 = (($71) - ($72))|0;
 $74 = (($73|0) / 12)&-1;
 $75 = $59;
 $76 = ($74>>>0)>=($75>>>0);
 if ($76) {
  $77 = $59;
  $78 = $60;
  $50 = $63;
  $51 = $77;
  $52 = $78;
  $79 = $50;
  $49 = $79;
  $80 = $49;
  $81 = ((($80)) + 8|0);
  $48 = $81;
  $82 = $48;
  $47 = $82;
  $83 = $47;
  $53 = $83;
  while(1) {
   $29 = $54;
   $30 = $79;
   $31 = 1;
   $84 = $53;
   $85 = ((($79)) + 4|0);
   $86 = HEAP32[$85>>2]|0;
   $28 = $86;
   $87 = $28;
   $88 = $52;
   $42 = $84;
   $43 = $87;
   $44 = $88;
   $89 = $42;
   $90 = $43;
   $91 = $44;
   $41 = $91;
   $92 = $41;
   ;HEAP8[$40>>0]=HEAP8[$45>>0]|0;
   $37 = $89;
   $38 = $90;
   $39 = $92;
   $93 = $37;
   $94 = $38;
   $95 = $39;
   $36 = $95;
   $96 = $36;
   $33 = $93;
   $34 = $94;
   $35 = $96;
   $97 = $34;
   $98 = $35;
   $32 = $98;
   $99 = $32;
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($97,$99);
   $100 = ((($79)) + 4|0);
   $101 = HEAP32[$100>>2]|0;
   $102 = ((($101)) + 12|0);
   HEAP32[$100>>2] = $102;
   $103 = $51;
   $104 = (($103) + -1)|0;
   $51 = $104;
   $46 = $54;
   $105 = $51;
   $106 = ($105>>>0)>(0);
   if (!($106)) {
    break;
   }
  }
  STACKTOP = sp;return;
 }
 $27 = $63;
 $107 = $27;
 $108 = ((($107)) + 8|0);
 $26 = $108;
 $109 = $26;
 $25 = $109;
 $110 = $25;
 $61 = $110;
 $24 = $63;
 $111 = $24;
 $112 = ((($111)) + 4|0);
 $113 = HEAP32[$112>>2]|0;
 $114 = HEAP32[$111>>2]|0;
 $115 = $113;
 $116 = $114;
 $117 = (($115) - ($116))|0;
 $118 = (($117|0) / 12)&-1;
 $119 = $59;
 $120 = (($118) + ($119))|0;
 $19 = $63;
 HEAP32[$20>>2] = $120;
 $121 = $19;
 $122 = (__ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8max_sizeEv($121)|0);
 $21 = $122;
 $123 = HEAP32[$20>>2]|0;
 $124 = $21;
 $125 = ($123>>>0)>($124>>>0);
 if ($125) {
  __ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv($121);
  // unreachable;
 }
 $17 = $121;
 $126 = $17;
 $16 = $126;
 $127 = $16;
 $15 = $127;
 $128 = $15;
 $129 = ((($128)) + 8|0);
 $14 = $129;
 $130 = $14;
 $13 = $130;
 $131 = $13;
 $132 = HEAP32[$131>>2]|0;
 $133 = HEAP32[$127>>2]|0;
 $134 = $132;
 $135 = $133;
 $136 = (($134) - ($135))|0;
 $137 = (($136|0) / 12)&-1;
 $22 = $137;
 $138 = $22;
 $139 = $21;
 $140 = (($139>>>0) / 2)&-1;
 $141 = ($138>>>0)>=($140>>>0);
 if ($141) {
  $142 = $21;
  $18 = $142;
 } else {
  $143 = $22;
  $144 = $143<<1;
  HEAP32[$23>>2] = $144;
  $10 = $23;
  $11 = $20;
  $145 = $10;
  $146 = $11;
  ;HEAP8[$9>>0]=HEAP8[$12>>0]|0;
  $7 = $145;
  $8 = $146;
  $147 = $7;
  $148 = $8;
  $4 = $9;
  $5 = $147;
  $6 = $148;
  $149 = $5;
  $150 = HEAP32[$149>>2]|0;
  $151 = $6;
  $152 = HEAP32[$151>>2]|0;
  $153 = ($150>>>0)<($152>>>0);
  $154 = $8;
  $155 = $7;
  $156 = $153 ? $154 : $155;
  $157 = HEAP32[$156>>2]|0;
  $18 = $157;
 }
 $158 = $18;
 $3 = $63;
 $159 = $3;
 $160 = ((($159)) + 4|0);
 $161 = HEAP32[$160>>2]|0;
 $162 = HEAP32[$159>>2]|0;
 $163 = $161;
 $164 = $162;
 $165 = (($163) - ($164))|0;
 $166 = (($165|0) / 12)&-1;
 $167 = $61;
 __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEEC2EmmS8_($62,$158,$166,$167);
 $168 = $59;
 $169 = $60;
 __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEE18__construct_at_endEmRKS6_($62,$168,$169);
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS6_RS7_EE($63,$62);
 __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEED2Ev($62);
 STACKTOP = sp;return;
}
function __ZNSt3__214__split_bufferINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS4_IS6_EEE18__construct_at_endEmRKS6_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(96|0);
 $12 = sp;
 $17 = sp + 84|0;
 $21 = $0;
 $22 = $1;
 $23 = $2;
 $25 = $21;
 $20 = $25;
 $26 = $20;
 $27 = ((($26)) + 12|0);
 $19 = $27;
 $28 = $19;
 $29 = ((($28)) + 4|0);
 $18 = $29;
 $30 = $18;
 $31 = HEAP32[$30>>2]|0;
 $24 = $31;
 while(1) {
  $32 = $24;
  $33 = ((($25)) + 8|0);
  $34 = HEAP32[$33>>2]|0;
  $3 = $34;
  $35 = $3;
  $36 = $23;
  $14 = $32;
  $15 = $35;
  $16 = $36;
  $37 = $14;
  $38 = $15;
  $39 = $16;
  $13 = $39;
  $40 = $13;
  ;HEAP8[$12>>0]=HEAP8[$17>>0]|0;
  $9 = $37;
  $10 = $38;
  $11 = $40;
  $41 = $9;
  $42 = $10;
  $43 = $11;
  $8 = $43;
  $44 = $8;
  $5 = $41;
  $6 = $42;
  $7 = $44;
  $45 = $6;
  $46 = $7;
  $4 = $46;
  $47 = $4;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($45,$47);
  $48 = ((($25)) + 8|0);
  $49 = HEAP32[$48>>2]|0;
  $50 = ((($49)) + 12|0);
  HEAP32[$48>>2] = $50;
  $51 = $22;
  $52 = (($51) + -1)|0;
  $22 = $52;
  $53 = $22;
  $54 = ($53>>>0)>(0);
  if (!($54)) {
   break;
  }
 }
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal11NoBaseClass6verifyINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEvv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZN10emscripten8internal13getActualTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEPKvPT_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = (__ZN10emscripten8internal14getLightTypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEPKvRKT_($2)|0);
 STACKTOP = sp;return ($3|0);
}
function __ZN10emscripten8internal11NoBaseClass11getUpcasterINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPFvvEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (0|0);
}
function __ZN10emscripten8internal11NoBaseClass13getDowncasterINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPFvvEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (0|0);
}
function __ZN10emscripten8internal14raw_destructorINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEvPT_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ($2|0)==(0|0);
 if ($3) {
  STACKTOP = sp;return;
 }
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEED2Ev($2);
 __ZdlPv($2);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDINS0_17AllowedRawPointerINSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDINS0_17AllowedRawPointerIKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIPKNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11NoBaseClass3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (0|0);
}
function __ZN10emscripten8internal14getLightTypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEPKvRKT_($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return (2504|0);
}
function __ZN10emscripten8internal11LightTypeIDINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2504|0);
}
function __ZN10emscripten8internal11LightTypeIDIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2528|0);
}
function __ZN10emscripten8internal11LightTypeIDIPKNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2544|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4541|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJvEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4544|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJviEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4546|0);
}
function __ZN10emscripten8internal12operator_newINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEJEEEPT_DpOT0_() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0;
 var $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $10 = sp + 4|0;
 $12 = (__Znwm(12)|0);
 $11 = $12;
 $13 = $11;
 $9 = $13;
 $14 = $9;
 $8 = $14;
 HEAP32[$14>>2] = 0;
 $15 = ((($14)) + 4|0);
 HEAP32[$15>>2] = 0;
 $16 = ((($14)) + 8|0);
 HEAP32[$10>>2] = 0;
 $6 = $16;
 $7 = $10;
 $17 = $6;
 $18 = $7;
 $5 = $18;
 $19 = $5;
 $1 = $17;
 $2 = $19;
 $20 = $1;
 $21 = $2;
 $0 = $21;
 HEAP32[$20>>2] = 0;
 $4 = $17;
 $22 = $4;
 $3 = $22;
 STACKTOP = sp;return ($12|0);
}
function __ZN10emscripten8internal7InvokerIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEJEE6invokeEPFSC_vE($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = (FUNCTION_TABLE_i[$2 & 63]()|0);
 $4 = (__ZN10emscripten8internal11BindingTypeIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE10toWireTypeESC_($3)|0);
 STACKTOP = sp;return ($4|0);
}
function __ZNK10emscripten8internal12WithPoliciesIJNS_18allow_raw_pointersEEE11ArgTypeListIJPNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 1;
}
function __ZNK10emscripten8internal12WithPoliciesIJNS_18allow_raw_pointersEEE11ArgTypeListIJPNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEEEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE10toWireTypeESC_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2996|0);
}
function __ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvRKS9_EvPSB_JSD_EE6invokeERKSF_SG_PNS0_11BindingTypeIS9_EUt_E($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $6 = sp;
 $3 = $0;
 $4 = $1;
 $5 = $2;
 $7 = $4;
 $8 = (__ZN10emscripten8internal11BindingTypeIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeESC_($7)|0);
 $9 = $3;
 $$field = HEAP32[$9>>2]|0;
 $$index1 = ((($9)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 $10 = $$field2 >> 1;
 $11 = (($8) + ($10)|0);
 $12 = $$field2 & 1;
 $13 = ($12|0)!=(0);
 if ($13) {
  $14 = HEAP32[$11>>2]|0;
  $15 = (($14) + ($$field)|0);
  $16 = HEAP32[$15>>2]|0;
  $19 = $16;
 } else {
  $17 = $$field;
  $19 = $17;
 }
 $18 = $5;
 __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE12fromWireTypeEPNS9_Ut_E($6,$18);
 FUNCTION_TABLE_vii[$19 & 63]($11,$6);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($6);
 STACKTOP = sp;return;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEERKSC_EE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 3;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEERKSC_EE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEERKSB_EEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvRKS9_EEEPT_RKSG_($0) {
 $0 = $0|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $$index5 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(8)|0);
 $3 = $1;
 $$field = HEAP32[$3>>2]|0;
 $$index1 = ((($3)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 HEAP32[$2>>2] = $$field;
 $$index5 = ((($2)) + 4|0);
 HEAP32[$$index5>>2] = $$field2;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeESC_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEERKSB_EEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (3000|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJviiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4549|0);
}
function __ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvmRKS9_EvPSB_JmSD_EE6invokeERKSF_SG_mPNS0_11BindingTypeIS9_EUt_E($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $4 = 0, $5 = 0, $6 = 0;
 var $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $8 = sp;
 $4 = $0;
 $5 = $1;
 $6 = $2;
 $7 = $3;
 $9 = $5;
 $10 = (__ZN10emscripten8internal11BindingTypeIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeESC_($9)|0);
 $11 = $4;
 $$field = HEAP32[$11>>2]|0;
 $$index1 = ((($11)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 $12 = $$field2 >> 1;
 $13 = (($10) + ($12)|0);
 $14 = $$field2 & 1;
 $15 = ($14|0)!=(0);
 if ($15) {
  $16 = HEAP32[$13>>2]|0;
  $17 = (($16) + ($$field)|0);
  $18 = HEAP32[$17>>2]|0;
  $23 = $18;
 } else {
  $19 = $$field;
  $23 = $19;
 }
 $20 = $6;
 $21 = (__ZN10emscripten8internal11BindingTypeImE12fromWireTypeEm($20)|0);
 $22 = $7;
 __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE12fromWireTypeEPNS9_Ut_E($8,$22);
 FUNCTION_TABLE_viii[$23 & 63]($13,$21,$8);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($8);
 STACKTOP = sp;return;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEmRKSC_EE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 4;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEmRKSC_EE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEmRKSB_EEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvmRKS9_EEEPT_RKSG_($0) {
 $0 = $0|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $$index5 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(8)|0);
 $3 = $1;
 $$field = HEAP32[$3>>2]|0;
 $$index1 = ((($3)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 HEAP32[$2>>2] = $$field;
 $$index5 = ((($2)) + 4|0);
 HEAP32[$$index5>>2] = $$field2;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeImE12fromWireTypeEm($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJvNS0_17AllowedRawPointerINSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEmRKSB_EEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (16|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJviiiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4554|0);
}
function __ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEKFmvEmPKSB_JEE6invokeERKSD_SF_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $4 = sp;
 $2 = $0;
 $3 = $1;
 $5 = $3;
 $6 = (__ZN10emscripten8internal11BindingTypeIPKNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeESD_($5)|0);
 $7 = $2;
 $$field = HEAP32[$7>>2]|0;
 $$index1 = ((($7)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 $8 = $$field2 >> 1;
 $9 = (($6) + ($8)|0);
 $10 = $$field2 & 1;
 $11 = ($10|0)!=(0);
 if ($11) {
  $12 = HEAP32[$9>>2]|0;
  $13 = (($12) + ($$field)|0);
  $14 = HEAP32[$13>>2]|0;
  $16 = $14;
 } else {
  $15 = $$field;
  $16 = $15;
 }
 $17 = (FUNCTION_TABLE_ii[$16 & 63]($9)|0);
 HEAP32[$4>>2] = $17;
 $18 = (__ZN10emscripten8internal11BindingTypeImE10toWireTypeERKm($4)|0);
 STACKTOP = sp;return ($18|0);
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEEE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 2;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEEEEE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEEEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal10getContextIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEKFmvEEEPT_RKSE_($0) {
 $0 = $0|0;
 var $$field = 0, $$field2 = 0, $$index1 = 0, $$index5 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(8)|0);
 $3 = $1;
 $$field = HEAP32[$3>>2]|0;
 $$index1 = ((($3)) + 4|0);
 $$field2 = HEAP32[$$index1>>2]|0;
 HEAP32[$2>>2] = $$field;
 $$index5 = ((($2)) + 4|0);
 HEAP32[$$index5>>2] = $$field2;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeImE10toWireTypeERKm($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = HEAP32[$2>>2]|0;
 STACKTOP = sp;return ($3|0);
}
function __ZN10emscripten8internal11BindingTypeIPKNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeESD_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJmNS0_17AllowedRawPointerIKNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEEEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (3012|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJiiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4560|0);
}
function __ZN10emscripten8internal15FunctionInvokerIPFNS_3valERKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmES2_SE_JmEE6invokeEPSG_PSC_m($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $6 = sp;
 $3 = $0;
 $4 = $1;
 $5 = $2;
 $7 = $3;
 $8 = HEAP32[$7>>2]|0;
 $9 = $4;
 $10 = (__ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeEPSB_($9)|0);
 $11 = $5;
 $12 = (__ZN10emscripten8internal11BindingTypeImE12fromWireTypeEm($11)|0);
 FUNCTION_TABLE_viii[$8 & 63]($6,$10,$12);
 $13 = (__ZN10emscripten8internal11BindingTypeINS_3valEE10toWireTypeERKS2_($6)|0);
 __ZN10emscripten3valD2Ev($6);
 STACKTOP = sp;return ($13|0);
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJNS_3valERKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEmEE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 3;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJNS_3valERKNSt3__26vectorINS5_12basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEENSA_ISC_EEEEmEE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJNS_3valERKNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmEEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal10getContextIPFNS_3valERKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmEEEPT_RKSH_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(4)|0);
 $3 = $1;
 $4 = HEAP32[$3>>2]|0;
 HEAP32[$2>>2] = $4;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeINS_3valEE10toWireTypeERKS2_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = HEAP32[$2>>2]|0;
 __emval_incref(($3|0));
 $4 = $1;
 $5 = HEAP32[$4>>2]|0;
 STACKTOP = sp;return ($5|0);
}
function __ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeEPSB_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten3valD2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = HEAP32[$2>>2]|0;
 __emval_decref(($3|0));
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJNS_3valERKNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (3020|0);
}
function __ZN10emscripten3valC2IRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEOT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $5 = sp;
 $3 = $0;
 $4 = $1;
 $6 = $3;
 $7 = $4;
 $2 = $7;
 $8 = $2;
 __ZN10emscripten8internal12WireTypePackIJRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEC2ESA_($5,$8);
 $9 = (__ZN10emscripten8internal6TypeIDIRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv()|0);
 $10 = (__ZNK10emscripten8internal12WireTypePackIJRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEcvPKvEv($5)|0);
 $11 = (__emval_take_value(($9|0),($10|0))|0);
 HEAP32[$6>>2] = $11;
 STACKTOP = sp;return;
}
function __ZN10emscripten3val9undefinedEv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10emscripten3valC2EPNS_8internal7_EM_VALE($0,(1));
 return;
}
function __ZN10emscripten8internal12WireTypePackIJRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEC2ESA_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $9 = sp;
 $7 = $0;
 $8 = $1;
 $10 = $7;
 $6 = $10;
 $11 = $6;
 HEAP32[$9>>2] = $11;
 $12 = $8;
 $2 = $12;
 $13 = $2;
 $4 = $9;
 $5 = $13;
 $14 = $4;
 $15 = $5;
 $3 = $15;
 $16 = $3;
 $17 = (__ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE10toWireTypeERKS8_($16)|0);
 __ZN10emscripten8internal20writeGenericWireTypeINS0_11BindingTypeINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEUt_EEEvRPNS0_15GenericWireTypeEPT_($14,$17);
 $18 = $4;
 __ZN10emscripten8internal21writeGenericWireTypesERPNS0_15GenericWireTypeE($18);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDIRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv()|0);
 return ($0|0);
}
function __ZNK10emscripten8internal12WireTypePackIJRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEEEcvPKvEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $2;
 $1 = $3;
 $4 = $1;
 STACKTOP = sp;return ($4|0);
}
function __ZN10emscripten8internal20writeGenericWireTypeINS0_11BindingTypeINSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEEUt_EEEvRPNS0_15GenericWireTypeEPT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = $3;
 $5 = $2;
 $6 = HEAP32[$5>>2]|0;
 HEAP32[$6>>2] = $4;
 $7 = $2;
 $8 = HEAP32[$7>>2]|0;
 $9 = ((($8)) + 8|0);
 HEAP32[$7>>2] = $9;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE10toWireTypeERKS8_($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0;
 var $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0;
 var $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0;
 var $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0;
 var $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0;
 var $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0;
 var $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 208|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(208|0);
 $48 = $0;
 $50 = $48;
 $47 = $50;
 $51 = $47;
 $46 = $51;
 $52 = $46;
 $45 = $52;
 $53 = $45;
 $44 = $53;
 $54 = $44;
 $43 = $54;
 $55 = $43;
 $56 = ((($55)) + 11|0);
 $57 = HEAP8[$56>>0]|0;
 $58 = $57&255;
 $59 = $58 & 128;
 $60 = ($59|0)!=(0);
 if ($60) {
  $39 = $52;
  $61 = $39;
  $38 = $61;
  $62 = $38;
  $37 = $62;
  $63 = $37;
  $64 = ((($63)) + 4|0);
  $65 = HEAP32[$64>>2]|0;
  $73 = $65;
 } else {
  $42 = $52;
  $66 = $42;
  $41 = $66;
  $67 = $41;
  $40 = $67;
  $68 = $40;
  $69 = ((($68)) + 11|0);
  $70 = HEAP8[$69>>0]|0;
  $71 = $70&255;
  $73 = $71;
 }
 $72 = (4 + ($73))|0;
 $74 = (_malloc($72)|0);
 $49 = $74;
 $75 = $48;
 $11 = $75;
 $76 = $11;
 $10 = $76;
 $77 = $10;
 $9 = $77;
 $78 = $9;
 $8 = $78;
 $79 = $8;
 $7 = $79;
 $80 = $7;
 $81 = ((($80)) + 11|0);
 $82 = HEAP8[$81>>0]|0;
 $83 = $82&255;
 $84 = $83 & 128;
 $85 = ($84|0)!=(0);
 if ($85) {
  $3 = $77;
  $86 = $3;
  $2 = $86;
  $87 = $2;
  $1 = $87;
  $88 = $1;
  $89 = ((($88)) + 4|0);
  $90 = HEAP32[$89>>2]|0;
  $98 = $90;
 } else {
  $6 = $77;
  $91 = $6;
  $5 = $91;
  $92 = $5;
  $4 = $92;
  $93 = $4;
  $94 = ((($93)) + 11|0);
  $95 = HEAP8[$94>>0]|0;
  $96 = $95&255;
  $98 = $96;
 }
 $97 = $49;
 HEAP32[$97>>2] = $98;
 $99 = $49;
 $100 = ((($99)) + 4|0);
 $101 = $48;
 $25 = $101;
 $102 = $25;
 $24 = $102;
 $103 = $24;
 $23 = $103;
 $104 = $23;
 $22 = $104;
 $105 = $22;
 $21 = $105;
 $106 = $21;
 $107 = ((($106)) + 11|0);
 $108 = HEAP8[$107>>0]|0;
 $109 = $108&255;
 $110 = $109 & 128;
 $111 = ($110|0)!=(0);
 if ($111) {
  $15 = $103;
  $112 = $15;
  $14 = $112;
  $113 = $14;
  $13 = $113;
  $114 = $13;
  $115 = HEAP32[$114>>2]|0;
  $121 = $115;
 } else {
  $20 = $103;
  $116 = $20;
  $19 = $116;
  $117 = $19;
  $18 = $117;
  $118 = $18;
  $17 = $118;
  $119 = $17;
  $16 = $119;
  $120 = $16;
  $121 = $120;
 }
 $12 = $121;
 $122 = $12;
 $123 = $48;
 $36 = $123;
 $124 = $36;
 $35 = $124;
 $125 = $35;
 $34 = $125;
 $126 = $34;
 $33 = $126;
 $127 = $33;
 $32 = $127;
 $128 = $32;
 $129 = ((($128)) + 11|0);
 $130 = HEAP8[$129>>0]|0;
 $131 = $130&255;
 $132 = $131 & 128;
 $133 = ($132|0)!=(0);
 if ($133) {
  $28 = $125;
  $134 = $28;
  $27 = $134;
  $135 = $27;
  $26 = $135;
  $136 = $26;
  $137 = ((($136)) + 4|0);
  $138 = HEAP32[$137>>2]|0;
  $145 = $138;
  _memcpy(($100|0),($122|0),($145|0))|0;
  $146 = $49;
  STACKTOP = sp;return ($146|0);
 } else {
  $31 = $125;
  $139 = $31;
  $30 = $139;
  $140 = $30;
  $29 = $140;
  $141 = $29;
  $142 = ((($141)) + 11|0);
  $143 = HEAP8[$142>>0]|0;
  $144 = $143&255;
  $145 = $144;
  _memcpy(($100|0),($122|0),($145|0))|0;
  $146 = $49;
  STACKTOP = sp;return ($146|0);
 }
 return (0)|0;
}
function __ZN10emscripten8internal21writeGenericWireTypesERPNS0_15GenericWireTypeE($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal11LightTypeIDIRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2448|0);
}
function __ZN10emscripten3valC2EPNS_8internal7_EM_VALE($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = $2;
 $5 = $3;
 HEAP32[$4>>2] = $5;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal15FunctionInvokerIPFbRNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEmRKS9_EbSC_JmSE_EE6invokeEPSG_PSB_mPNS0_11BindingTypeIS9_EUt_E($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $8 = sp;
 $4 = $0;
 $5 = $1;
 $6 = $2;
 $7 = $3;
 $9 = $4;
 $10 = HEAP32[$9>>2]|0;
 $11 = $5;
 $12 = (__ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeEPSB_($11)|0);
 $13 = $6;
 $14 = (__ZN10emscripten8internal11BindingTypeImE12fromWireTypeEm($13)|0);
 $15 = $7;
 __ZN10emscripten8internal11BindingTypeINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE12fromWireTypeEPNS9_Ut_E($8,$15);
 $16 = (FUNCTION_TABLE_iiii[$10 & 63]($12,$14,$8)|0);
 $17 = (__ZN10emscripten8internal11BindingTypeIbE10toWireTypeEb($16)|0);
 __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($8);
 STACKTOP = sp;return ($17|0);
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJbRNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmRKSB_EE8getCountEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 4;
}
function __ZNK10emscripten8internal12WithPoliciesIJEE11ArgTypeListIJbRNSt3__26vectorINS4_12basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEENS9_ISB_EEEEmRKSB_EE8getTypesEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJbRNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmRKSA_EEEE3getEv()|0);
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal10getContextIPFbRNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEmRKS9_EEEPT_RKSH_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(4)|0);
 $3 = $1;
 $4 = HEAP32[$3>>2]|0;
 HEAP32[$2>>2] = $4;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeIbE10toWireTypeEb($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0&1;
 $1 = $2;
 $3 = $1;
 $4 = $3&1;
 STACKTOP = sp;return ($4|0);
}
function __ZN10emscripten8internal14ArgArrayGetterINS0_8TypeListIJbRNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmRKSA_EEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (32|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJiiiiiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4583|0);
}
function __ZN10emscripten8internal11noncopyableC2Ev($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal15raw_constructorI14StrategyResultJEEEPT_DpNS0_11BindingTypeIT0_E8WireTypeE() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__Znwm(16)|0);
 ;HEAP32[$0>>2]=0|0;HEAP32[$0+4>>2]=0|0;HEAP32[$0+8>>2]=0|0;HEAP32[$0+12>>2]=0|0;
 __ZN14StrategyResultC2Ev($0);
 return ($0|0);
}
function __ZN10emscripten8internal14raw_destructorI14StrategyResultEEvPT_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = ($2|0)==(0|0);
 if (!($3)) {
  __ZN14StrategyResultD2Ev($2);
  __ZdlPv($2);
 }
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDI14StrategyResultE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDI14StrategyResultE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11noncopyableD2Ev($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return;
}
function __ZN14StrategyResultC2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $11 = sp + 8|0;
 $13 = $0;
 $14 = $13;
 $15 = ((($14)) + 4|0);
 $12 = $15;
 $16 = $12;
 $10 = $16;
 $17 = $10;
 $9 = $17;
 HEAP32[$17>>2] = 0;
 $18 = ((($17)) + 4|0);
 HEAP32[$18>>2] = 0;
 $19 = ((($17)) + 8|0);
 HEAP32[$11>>2] = 0;
 $7 = $19;
 $8 = $11;
 $20 = $7;
 $21 = $8;
 $6 = $21;
 $22 = $6;
 $2 = $20;
 $3 = $22;
 $23 = $2;
 $24 = $3;
 $1 = $24;
 HEAP32[$23>>2] = 0;
 $5 = $20;
 $25 = $5;
 $4 = $25;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal11LightTypeIDI14StrategyResultE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2432|0);
}
function __ZN10emscripten8internal19getGenericSignatureIJiEEEPKcv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (4589|0);
}
function __ZN10emscripten8internal12MemberAccessI14StrategyResultiE7getWireIS2_EEiRKMS2_iRKT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = $3;
 $5 = $2;
 $6 = HEAP32[$5>>2]|0;
 $7 = (($4) + ($6)|0);
 $8 = (__ZN10emscripten8internal11BindingTypeIiE10toWireTypeERKi($7)|0);
 STACKTOP = sp;return ($8|0);
}
function __ZN10emscripten8internal12MemberAccessI14StrategyResultiE7setWireIS2_EEvRKMS2_iRT_i($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = $0;
 $4 = $1;
 $5 = $2;
 $6 = $5;
 $7 = (__ZN10emscripten8internal11BindingTypeIiE12fromWireTypeEi($6)|0);
 $8 = $4;
 $9 = $3;
 $10 = HEAP32[$9>>2]|0;
 $11 = (($8) + ($10)|0);
 HEAP32[$11>>2] = $7;
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDIiE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIiE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal10getContextIM14StrategyResultiEEPT_RKS4_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(4)|0);
 $3 = $1;
 $4 = HEAP32[$3>>2]|0;
 HEAP32[$2>>2] = $4;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11BindingTypeIiE10toWireTypeERKi($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 $3 = HEAP32[$2>>2]|0;
 STACKTOP = sp;return ($3|0);
}
function __ZN10emscripten8internal11BindingTypeIiE12fromWireTypeEi($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal11LightTypeIDIiE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2920|0);
}
function __ZN10emscripten8internal12MemberAccessI14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEE7getWireIS2_EEPSC_RKMS2_SC_RKT_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = $3;
 $5 = $2;
 $6 = HEAP32[$5>>2]|0;
 $7 = (($4) + ($6)|0);
 $8 = (__ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE10toWireTypeERKSB_($7)|0);
 STACKTOP = sp;return ($8|0);
}
function __ZN10emscripten8internal12MemberAccessI14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEE7setWireIS2_EEvRKMS2_SC_RT_PSC_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $5 = sp;
 $8 = sp + 40|0;
 $11 = $0;
 $12 = $1;
 $13 = $2;
 $14 = $13;
 $15 = (__ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE12fromWireTypeEPSB_($14)|0);
 $16 = $12;
 $17 = $11;
 $18 = HEAP32[$17>>2]|0;
 $19 = (($16) + ($18)|0);
 $9 = $19;
 $10 = $15;
 $20 = $9;
 $21 = $10;
 $22 = ($20|0)!=($21|0);
 if (!($22)) {
  STACKTOP = sp;return;
 }
 $23 = $10;
 $6 = $20;
 $7 = $23;
 $24 = $6;
 $25 = $7;
 ;HEAP8[$5>>0]=HEAP8[$8>>0]|0;
 $3 = $24;
 $4 = $25;
 $26 = $10;
 $27 = HEAP32[$26>>2]|0;
 $28 = $10;
 $29 = ((($28)) + 4|0);
 $30 = HEAP32[$29>>2]|0;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6assignIPS6_EENS_9enable_ifIXaasr21__is_forward_iteratorIT_EE5valuesr16is_constructibleIS6_NS_15iterator_traitsISC_E9referenceEEE5valueEvE4typeESC_SC_($20,$27,$30);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal10getContextIM14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEEEPT_RKSE_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(4)|0);
 $3 = $1;
 $4 = HEAP32[$3>>2]|0;
 HEAP32[$2>>2] = $4;
 STACKTOP = sp;return ($2|0);
}
function __ZN10emscripten8internal18GenericBindingTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE10toWireTypeERKSB_($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__Znwm(12)|0);
 $3 = $1;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEEC2ERKS8_($2,$3);
 STACKTOP = sp;return ($2|0);
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEEC2ERKS8_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0;
 var $65 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 112|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(112|0);
 $17 = sp + 36|0;
 $19 = sp;
 $21 = sp + 101|0;
 $27 = sp + 100|0;
 $25 = $0;
 $26 = $1;
 $29 = $25;
 $30 = $26;
 $24 = $30;
 $31 = $24;
 $32 = ((($31)) + 8|0);
 $23 = $32;
 $33 = $23;
 $22 = $33;
 $34 = $22;
 $20 = $34;
 $35 = $20;
 ;HEAP8[$19>>0]=HEAP8[$21>>0]|0;
 $18 = $35;
 $15 = $29;
 $16 = $27;
 $36 = $15;
 $14 = $36;
 HEAP32[$36>>2] = 0;
 $37 = ((($36)) + 4|0);
 HEAP32[$37>>2] = 0;
 $38 = ((($36)) + 8|0);
 HEAP32[$17>>2] = 0;
 $39 = $16;
 $11 = $38;
 $12 = $17;
 $13 = $39;
 $40 = $11;
 $41 = $12;
 $10 = $41;
 $42 = $10;
 $4 = $40;
 $5 = $42;
 $43 = $4;
 $44 = $5;
 $3 = $44;
 HEAP32[$43>>2] = 0;
 $45 = $13;
 $6 = $45;
 $46 = $6;
 $8 = $40;
 $9 = $46;
 $47 = $9;
 $7 = $47;
 $48 = $26;
 $2 = $48;
 $49 = $2;
 $50 = ((($49)) + 4|0);
 $51 = HEAP32[$50>>2]|0;
 $52 = HEAP32[$49>>2]|0;
 $53 = $51;
 $54 = $52;
 $55 = (($53) - ($54))|0;
 $56 = (($55|0) / 12)&-1;
 $28 = $56;
 $57 = $28;
 $58 = ($57>>>0)>(0);
 if (!($58)) {
  STACKTOP = sp;return;
 }
 $59 = $28;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8allocateEm($29,$59);
 $60 = $26;
 $61 = HEAP32[$60>>2]|0;
 $62 = $26;
 $63 = ((($62)) + 4|0);
 $64 = HEAP32[$63>>2]|0;
 $65 = $28;
 __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endIPS6_EENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESC_SC_m($29,$61,$64,$65);
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endIPS6_EENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESC_SC_m($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $15 = sp;
 $20 = sp + 121|0;
 $35 = sp + 120|0;
 $30 = $0;
 $31 = $1;
 $32 = $2;
 $33 = $3;
 $36 = $30;
 $29 = $36;
 $37 = $29;
 $38 = ((($37)) + 8|0);
 $28 = $38;
 $39 = $28;
 $27 = $39;
 $40 = $27;
 $34 = $40;
 $41 = $33;
 $4 = $35;
 $5 = $36;
 $6 = $41;
 $42 = $34;
 $43 = $31;
 $44 = $32;
 $45 = ((($36)) + 4|0);
 $22 = $42;
 $23 = $43;
 $24 = $44;
 $25 = $45;
 while(1) {
  $46 = $23;
  $47 = $24;
  $48 = ($46|0)!=($47|0);
  if (!($48)) {
   break;
  }
  $49 = $22;
  $50 = $25;
  $51 = HEAP32[$50>>2]|0;
  $21 = $51;
  $52 = $21;
  $53 = $23;
  $17 = $49;
  $18 = $52;
  $19 = $53;
  $54 = $17;
  $55 = $18;
  $56 = $19;
  $16 = $56;
  $57 = $16;
  ;HEAP8[$15>>0]=HEAP8[$20>>0]|0;
  $12 = $54;
  $13 = $55;
  $14 = $57;
  $58 = $12;
  $59 = $13;
  $60 = $14;
  $11 = $60;
  $61 = $11;
  $8 = $58;
  $9 = $59;
  $10 = $61;
  $62 = $9;
  $63 = $10;
  $7 = $63;
  $64 = $7;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($62,$64);
  $65 = $23;
  $66 = ((($65)) + 12|0);
  $23 = $66;
  $67 = $25;
  $68 = HEAP32[$67>>2]|0;
  $69 = ((($68)) + 12|0);
  HEAP32[$67>>2] = $69;
 }
 $26 = $35;
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6assignIPS6_EENS_9enable_ifIXaasr21__is_forward_iteratorIT_EE5valuesr16is_constructibleIS6_NS_15iterator_traitsISC_E9referenceEEE5valueEvE4typeESC_SC_($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0;
 var $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0;
 var $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0;
 var $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0;
 var $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0;
 var $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $3 = 0, $30 = 0;
 var $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0;
 var $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0;
 var $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0;
 var $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 400|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(400|0);
 $7 = sp + 24|0;
 $10 = sp + 392|0;
 $57 = sp + 16|0;
 $60 = sp + 391|0;
 $67 = sp + 8|0;
 $70 = sp + 390|0;
 $78 = sp + 108|0;
 $81 = sp + 96|0;
 $91 = sp;
 $94 = sp + 389|0;
 $99 = sp + 32|0;
 $95 = $0;
 $96 = $1;
 $97 = $2;
 $102 = $95;
 $103 = $96;
 $104 = $97;
 $92 = $103;
 $93 = $104;
 $105 = $92;
 $106 = $93;
 ;HEAP8[$91>>0]=HEAP8[$94>>0]|0;
 $89 = $105;
 $90 = $106;
 $107 = $90;
 $108 = $89;
 $109 = $107;
 $110 = $108;
 $111 = (($109) - ($110))|0;
 $112 = (($111|0) / 12)&-1;
 $98 = $112;
 $113 = $98;
 $87 = $102;
 $114 = $87;
 $86 = $114;
 $115 = $86;
 $85 = $115;
 $116 = $85;
 $117 = ((($116)) + 8|0);
 $84 = $117;
 $118 = $84;
 $83 = $118;
 $119 = $83;
 $120 = HEAP32[$119>>2]|0;
 $121 = HEAP32[$115>>2]|0;
 $122 = $120;
 $123 = $121;
 $124 = (($122) - ($123))|0;
 $125 = (($124|0) / 12)&-1;
 $126 = ($113>>>0)<=($125>>>0);
 if (!($126)) {
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE10deallocateEv($102);
  $256 = $98;
  $77 = $102;
  HEAP32[$78>>2] = $256;
  $257 = $77;
  $258 = (__ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8max_sizeEv($257)|0);
  $79 = $258;
  $259 = HEAP32[$78>>2]|0;
  $260 = $79;
  $261 = ($259>>>0)>($260>>>0);
  if ($261) {
   __ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv($257);
   // unreachable;
  }
  $75 = $257;
  $262 = $75;
  $74 = $262;
  $263 = $74;
  $73 = $263;
  $264 = $73;
  $265 = ((($264)) + 8|0);
  $72 = $265;
  $266 = $72;
  $71 = $266;
  $267 = $71;
  $268 = HEAP32[$267>>2]|0;
  $269 = HEAP32[$263>>2]|0;
  $270 = $268;
  $271 = $269;
  $272 = (($270) - ($271))|0;
  $273 = (($272|0) / 12)&-1;
  $80 = $273;
  $274 = $80;
  $275 = $79;
  $276 = (($275>>>0) / 2)&-1;
  $277 = ($274>>>0)>=($276>>>0);
  if ($277) {
   $278 = $79;
   $76 = $278;
  } else {
   $279 = $80;
   $280 = $279<<1;
   HEAP32[$81>>2] = $280;
   $68 = $81;
   $69 = $78;
   $281 = $68;
   $282 = $69;
   ;HEAP8[$67>>0]=HEAP8[$70>>0]|0;
   $65 = $281;
   $66 = $282;
   $283 = $65;
   $284 = $66;
   $62 = $67;
   $63 = $283;
   $64 = $284;
   $285 = $63;
   $286 = HEAP32[$285>>2]|0;
   $287 = $64;
   $288 = HEAP32[$287>>2]|0;
   $289 = ($286>>>0)<($288>>>0);
   $290 = $66;
   $291 = $65;
   $292 = $289 ? $290 : $291;
   $293 = HEAP32[$292>>2]|0;
   $76 = $293;
  }
  $294 = $76;
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE8allocateEm($102,$294);
  $295 = $96;
  $296 = $97;
  $297 = $98;
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endIPS6_EENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESC_SC_m($102,$295,$296,$297);
  $88 = $102;
  STACKTOP = sp;return;
 }
 $127 = $97;
 HEAP32[$99>>2] = $127;
 $100 = 0;
 $128 = $98;
 $82 = $102;
 $129 = $82;
 $130 = ((($129)) + 4|0);
 $131 = HEAP32[$130>>2]|0;
 $132 = HEAP32[$129>>2]|0;
 $133 = $131;
 $134 = $132;
 $135 = (($133) - ($134))|0;
 $136 = (($135|0) / 12)&-1;
 $137 = ($128>>>0)>($136>>>0);
 if ($137) {
  $100 = 1;
  $138 = $96;
  HEAP32[$99>>2] = $138;
  $61 = $102;
  $139 = $61;
  $140 = ((($139)) + 4|0);
  $141 = HEAP32[$140>>2]|0;
  $142 = HEAP32[$139>>2]|0;
  $143 = $141;
  $144 = $142;
  $145 = (($143) - ($144))|0;
  $146 = (($145|0) / 12)&-1;
  $58 = $99;
  $59 = $146;
  $147 = $58;
  $148 = $59;
  ;HEAP8[$57>>0]=HEAP8[$60>>0]|0;
  $55 = $147;
  $56 = $148;
  $149 = $56;
  $150 = $55;
  $151 = HEAP32[$150>>2]|0;
  $152 = (($151) + (($149*12)|0)|0);
  HEAP32[$150>>2] = $152;
 }
 $153 = $96;
 $154 = HEAP32[$99>>2]|0;
 $155 = HEAP32[$102>>2]|0;
 $52 = $153;
 $53 = $154;
 $54 = $155;
 $156 = $52;
 $51 = $156;
 $157 = $51;
 $158 = $53;
 $47 = $158;
 $159 = $47;
 $160 = $54;
 $46 = $160;
 $161 = $46;
 $48 = $157;
 $49 = $159;
 $50 = $161;
 while(1) {
  $162 = $48;
  $163 = $49;
  $164 = ($162|0)!=($163|0);
  if (!($164)) {
   break;
  }
  $165 = $48;
  $166 = $50;
  (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEaSERKS5_($166,$165)|0);
  $167 = $48;
  $168 = ((($167)) + 12|0);
  $48 = $168;
  $169 = $50;
  $170 = ((($169)) + 12|0);
  $50 = $170;
 }
 $171 = $50;
 $101 = $171;
 $172 = $100;
 $173 = $172&1;
 if ($173) {
  $174 = HEAP32[$99>>2]|0;
  $175 = $97;
  $176 = $98;
  $45 = $102;
  $177 = $45;
  $178 = ((($177)) + 4|0);
  $179 = HEAP32[$178>>2]|0;
  $180 = HEAP32[$177>>2]|0;
  $181 = $179;
  $182 = $180;
  $183 = (($181) - ($182))|0;
  $184 = (($183|0) / 12)&-1;
  $185 = (($176) - ($184))|0;
  __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE18__construct_at_endIPS6_EENS_9enable_ifIXsr21__is_forward_iteratorIT_EE5valueEvE4typeESC_SC_m($102,$174,$175,$185);
  $88 = $102;
  STACKTOP = sp;return;
 }
 $186 = $101;
 $42 = $102;
 $43 = $186;
 $187 = $42;
 $188 = $43;
 $40 = $187;
 $41 = $188;
 $39 = $187;
 $189 = $39;
 $190 = ((($189)) + 4|0);
 $191 = HEAP32[$190>>2]|0;
 $192 = HEAP32[$189>>2]|0;
 $193 = $191;
 $194 = $192;
 $195 = (($193) - ($194))|0;
 $196 = (($195|0) / 12)&-1;
 $44 = $196;
 $197 = $43;
 $15 = $187;
 $16 = $197;
 $198 = $15;
 $199 = ((($198)) + 4|0);
 $200 = HEAP32[$199>>2]|0;
 $17 = $200;
 while(1) {
  $201 = $16;
  $202 = $17;
  $203 = ($201|0)!=($202|0);
  if (!($203)) {
   break;
  }
  $14 = $198;
  $204 = $14;
  $205 = ((($204)) + 8|0);
  $13 = $205;
  $206 = $13;
  $12 = $206;
  $207 = $12;
  $208 = $17;
  $209 = ((($208)) + -12|0);
  $17 = $209;
  $11 = $209;
  $210 = $11;
  $8 = $207;
  $9 = $210;
  $211 = $8;
  $212 = $9;
  ;HEAP8[$7>>0]=HEAP8[$10>>0]|0;
  $5 = $211;
  $6 = $212;
  $213 = $5;
  $214 = $6;
  $3 = $213;
  $4 = $214;
  $215 = $4;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($215);
 }
 $216 = $16;
 $217 = ((($198)) + 4|0);
 HEAP32[$217>>2] = $216;
 $218 = $44;
 $37 = $187;
 $38 = $218;
 $219 = $37;
 $36 = $219;
 $220 = $36;
 $221 = HEAP32[$220>>2]|0;
 $35 = $221;
 $222 = $35;
 $19 = $219;
 $223 = $19;
 $224 = HEAP32[$223>>2]|0;
 $18 = $224;
 $225 = $18;
 $24 = $219;
 $226 = $24;
 $23 = $226;
 $227 = $23;
 $22 = $227;
 $228 = $22;
 $229 = ((($228)) + 8|0);
 $21 = $229;
 $230 = $21;
 $20 = $230;
 $231 = $20;
 $232 = HEAP32[$231>>2]|0;
 $233 = HEAP32[$227>>2]|0;
 $234 = $232;
 $235 = $233;
 $236 = (($234) - ($235))|0;
 $237 = (($236|0) / 12)&-1;
 $238 = (($225) + (($237*12)|0)|0);
 $26 = $219;
 $239 = $26;
 $240 = HEAP32[$239>>2]|0;
 $25 = $240;
 $241 = $25;
 $242 = $38;
 $243 = (($241) + (($242*12)|0)|0);
 $28 = $219;
 $244 = $28;
 $245 = HEAP32[$244>>2]|0;
 $27 = $245;
 $246 = $27;
 $29 = $219;
 $247 = $29;
 $248 = ((($247)) + 4|0);
 $249 = HEAP32[$248>>2]|0;
 $250 = HEAP32[$247>>2]|0;
 $251 = $249;
 $252 = $250;
 $253 = (($251) - ($252))|0;
 $254 = (($253|0) / 12)&-1;
 $255 = (($246) + (($254*12)|0)|0);
 $30 = $219;
 $31 = $222;
 $32 = $238;
 $33 = $243;
 $34 = $255;
 $88 = $102;
 STACKTOP = sp;return;
}
function __ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE10deallocateEv($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0;
 var $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0;
 var $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0;
 var $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0;
 var $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 240|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(240|0);
 $45 = sp;
 $48 = sp + 236|0;
 $60 = $0;
 $61 = $60;
 $62 = HEAP32[$61>>2]|0;
 $63 = ($62|0)!=(0|0);
 if (!($63)) {
  STACKTOP = sp;return;
 }
 $58 = $61;
 $64 = $58;
 $57 = $64;
 $65 = $57;
 $66 = ((($65)) + 4|0);
 $67 = HEAP32[$66>>2]|0;
 $68 = HEAP32[$65>>2]|0;
 $69 = $67;
 $70 = $68;
 $71 = (($69) - ($70))|0;
 $72 = (($71|0) / 12)&-1;
 $59 = $72;
 $56 = $64;
 $73 = $56;
 $74 = HEAP32[$73>>2]|0;
 $53 = $73;
 $54 = $74;
 $75 = $53;
 $76 = ((($75)) + 4|0);
 $77 = HEAP32[$76>>2]|0;
 $55 = $77;
 while(1) {
  $78 = $54;
  $79 = $55;
  $80 = ($78|0)!=($79|0);
  if (!($80)) {
   break;
  }
  $52 = $75;
  $81 = $52;
  $82 = ((($81)) + 8|0);
  $51 = $82;
  $83 = $51;
  $50 = $83;
  $84 = $50;
  $85 = $55;
  $86 = ((($85)) + -12|0);
  $55 = $86;
  $49 = $86;
  $87 = $49;
  $46 = $84;
  $47 = $87;
  $88 = $46;
  $89 = $47;
  ;HEAP8[$45>>0]=HEAP8[$48>>0]|0;
  $43 = $88;
  $44 = $89;
  $90 = $43;
  $91 = $44;
  $41 = $90;
  $42 = $91;
  $92 = $42;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($92);
 }
 $93 = $54;
 $94 = ((($75)) + 4|0);
 HEAP32[$94>>2] = $93;
 $95 = $59;
 $39 = $64;
 $40 = $95;
 $96 = $39;
 $38 = $96;
 $97 = $38;
 $98 = HEAP32[$97>>2]|0;
 $37 = $98;
 $99 = $37;
 $21 = $96;
 $100 = $21;
 $101 = HEAP32[$100>>2]|0;
 $20 = $101;
 $102 = $20;
 $26 = $96;
 $103 = $26;
 $25 = $103;
 $104 = $25;
 $24 = $104;
 $105 = $24;
 $106 = ((($105)) + 8|0);
 $23 = $106;
 $107 = $23;
 $22 = $107;
 $108 = $22;
 $109 = HEAP32[$108>>2]|0;
 $110 = HEAP32[$104>>2]|0;
 $111 = $109;
 $112 = $110;
 $113 = (($111) - ($112))|0;
 $114 = (($113|0) / 12)&-1;
 $115 = (($102) + (($114*12)|0)|0);
 $28 = $96;
 $116 = $28;
 $117 = HEAP32[$116>>2]|0;
 $27 = $117;
 $118 = $27;
 $119 = $40;
 $120 = (($118) + (($119*12)|0)|0);
 $30 = $96;
 $121 = $30;
 $122 = HEAP32[$121>>2]|0;
 $29 = $122;
 $123 = $29;
 $31 = $96;
 $124 = $31;
 $125 = ((($124)) + 4|0);
 $126 = HEAP32[$125>>2]|0;
 $127 = HEAP32[$124>>2]|0;
 $128 = $126;
 $129 = $127;
 $130 = (($128) - ($129))|0;
 $131 = (($130|0) / 12)&-1;
 $132 = (($123) + (($131*12)|0)|0);
 $32 = $96;
 $33 = $99;
 $34 = $115;
 $35 = $120;
 $36 = $132;
 $19 = $64;
 $18 = $61;
 $133 = $18;
 $134 = ((($133)) + 8|0);
 $17 = $134;
 $135 = $17;
 $16 = $135;
 $136 = $16;
 $137 = HEAP32[$61>>2]|0;
 $5 = $61;
 $138 = $5;
 $4 = $138;
 $139 = $4;
 $3 = $139;
 $140 = $3;
 $141 = ((($140)) + 8|0);
 $2 = $141;
 $142 = $2;
 $1 = $142;
 $143 = $1;
 $144 = HEAP32[$143>>2]|0;
 $145 = HEAP32[$139>>2]|0;
 $146 = $144;
 $147 = $145;
 $148 = (($146) - ($147))|0;
 $149 = (($148|0) / 12)&-1;
 $10 = $136;
 $11 = $137;
 $12 = $149;
 $150 = $10;
 $151 = $11;
 $152 = $12;
 $7 = $150;
 $8 = $151;
 $9 = $152;
 $153 = $8;
 $6 = $153;
 $154 = $6;
 __ZdlPv($154);
 $15 = $61;
 $155 = $15;
 $156 = ((($155)) + 8|0);
 $14 = $156;
 $157 = $14;
 $13 = $157;
 $158 = $13;
 HEAP32[$158>>2] = 0;
 $159 = ((($61)) + 4|0);
 HEAP32[$159>>2] = 0;
 HEAP32[$61>>2] = 0;
 STACKTOP = sp;return;
}
function __GLOBAL__sub_I_strategy_cpp() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___cxx_global_var_init();
 ___cxx_global_var_init_15();
 return;
}
function __GLOBAL__sub_I_bind_cpp() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___cxx_global_var_init_2();
 return;
}
function ___cxx_global_var_init_2() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN53EmscriptenBindingInitializer_native_and_builtin_typesC2Ev(8267);
 return;
}
function __ZN53EmscriptenBindingInitializer_native_and_builtin_typesC2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIvE3getEv()|0);
 __embind_register_void(($2|0),(4591|0));
 $3 = (__ZN10emscripten8internal6TypeIDIbE3getEv()|0);
 __embind_register_bool(($3|0),(4596|0),1,1,0);
 __ZN12_GLOBAL__N_116register_integerIcEEvPKc(4601);
 __ZN12_GLOBAL__N_116register_integerIaEEvPKc(4606);
 __ZN12_GLOBAL__N_116register_integerIhEEvPKc(4618);
 __ZN12_GLOBAL__N_116register_integerIsEEvPKc(4632);
 __ZN12_GLOBAL__N_116register_integerItEEvPKc(4638);
 __ZN12_GLOBAL__N_116register_integerIiEEvPKc(4653);
 __ZN12_GLOBAL__N_116register_integerIjEEvPKc(4657);
 __ZN12_GLOBAL__N_116register_integerIlEEvPKc(4670);
 __ZN12_GLOBAL__N_116register_integerImEEvPKc(4675);
 __ZN12_GLOBAL__N_114register_floatIfEEvPKc(4689);
 __ZN12_GLOBAL__N_114register_floatIdEEvPKc(4695);
 $4 = (__ZN10emscripten8internal6TypeIDINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv()|0);
 __embind_register_std_string(($4|0),(4702|0));
 $5 = (__ZN10emscripten8internal6TypeIDINSt3__212basic_stringIhNS2_11char_traitsIhEENS2_9allocatorIhEEEEE3getEv()|0);
 __embind_register_std_string(($5|0),(4714|0));
 $6 = (__ZN10emscripten8internal6TypeIDINSt3__212basic_stringIwNS2_11char_traitsIwEENS2_9allocatorIwEEEEE3getEv()|0);
 __embind_register_std_wstring(($6|0),4,(4747|0));
 $7 = (__ZN10emscripten8internal6TypeIDINS_3valEE3getEv()|0);
 __embind_register_emval(($7|0),(4760|0));
 __ZN12_GLOBAL__N_120register_memory_viewIcEEvPKc(4776);
 __ZN12_GLOBAL__N_120register_memory_viewIaEEvPKc(4806);
 __ZN12_GLOBAL__N_120register_memory_viewIhEEvPKc(4843);
 __ZN12_GLOBAL__N_120register_memory_viewIsEEvPKc(4882);
 __ZN12_GLOBAL__N_120register_memory_viewItEEvPKc(4913);
 __ZN12_GLOBAL__N_120register_memory_viewIiEEvPKc(4953);
 __ZN12_GLOBAL__N_120register_memory_viewIjEEvPKc(4982);
 __ZN12_GLOBAL__N_120register_memory_viewIlEEvPKc(5020);
 __ZN12_GLOBAL__N_120register_memory_viewImEEvPKc(5050);
 __ZN12_GLOBAL__N_120register_memory_viewIaEEvPKc(5089);
 __ZN12_GLOBAL__N_120register_memory_viewIhEEvPKc(5121);
 __ZN12_GLOBAL__N_120register_memory_viewIsEEvPKc(5154);
 __ZN12_GLOBAL__N_120register_memory_viewItEEvPKc(5187);
 __ZN12_GLOBAL__N_120register_memory_viewIiEEvPKc(5221);
 __ZN12_GLOBAL__N_120register_memory_viewIjEEvPKc(5254);
 __ZN12_GLOBAL__N_120register_memory_viewIfEEvPKc(5288);
 __ZN12_GLOBAL__N_120register_memory_viewIdEEvPKc(5319);
 __ZN12_GLOBAL__N_120register_memory_viewIeEEvPKc(5351);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDIvE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIvE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDIbE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIbE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_116register_integerIcEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIcE3getEv()|0);
 $3 = $1;
 $4 = -128 << 24 >> 24;
 $5 = 127 << 24 >> 24;
 __embind_register_integer(($2|0),($3|0),1,($4|0),($5|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIaEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIaE3getEv()|0);
 $3 = $1;
 $4 = -128 << 24 >> 24;
 $5 = 127 << 24 >> 24;
 __embind_register_integer(($2|0),($3|0),1,($4|0),($5|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIhEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIhE3getEv()|0);
 $3 = $1;
 $4 = 0;
 $5 = 255;
 __embind_register_integer(($2|0),($3|0),1,($4|0),($5|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIsEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIsE3getEv()|0);
 $3 = $1;
 $4 = -32768 << 16 >> 16;
 $5 = 32767 << 16 >> 16;
 __embind_register_integer(($2|0),($3|0),2,($4|0),($5|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerItEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDItE3getEv()|0);
 $3 = $1;
 $4 = 0;
 $5 = 65535;
 __embind_register_integer(($2|0),($3|0),2,($4|0),($5|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIiEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIiE3getEv()|0);
 $3 = $1;
 __embind_register_integer(($2|0),($3|0),4,-2147483648,2147483647);
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIjEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIjE3getEv()|0);
 $3 = $1;
 __embind_register_integer(($2|0),($3|0),4,0,-1);
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerIlEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIlE3getEv()|0);
 $3 = $1;
 __embind_register_integer(($2|0),($3|0),4,-2147483648,2147483647);
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_116register_integerImEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDImE3getEv()|0);
 $3 = $1;
 __embind_register_integer(($2|0),($3|0),4,0,-1);
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_114register_floatIfEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIfE3getEv()|0);
 $3 = $1;
 __embind_register_float(($2|0),($3|0),4);
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_114register_floatIdEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDIdE3getEv()|0);
 $3 = $1;
 __embind_register_float(($2|0),($3|0),8);
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDINSt3__212basic_stringIhNS2_11char_traitsIhEENS2_9allocatorIhEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIhNS2_11char_traitsIhEENS2_9allocatorIhEEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDINSt3__212basic_stringIwNS2_11char_traitsIwEENS2_9allocatorIwEEEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIwNS2_11char_traitsIwEENS2_9allocatorIwEEEEE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal6TypeIDINS_3valEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_3valEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_120register_memory_viewIcEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIcEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIcEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIaEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIaEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIaEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIhEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIhEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIhEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIsEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIsEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIsEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewItEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewItEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexItEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIiEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIiEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIiEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIjEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIjEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIjEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIlEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIlEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIlEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewImEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewImEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexImEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIfEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIfEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIfEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIdEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIdEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIdEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN12_GLOBAL__N_120register_memory_viewIeEEvPKc($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = (__ZN10emscripten8internal6TypeIDINS_11memory_viewIeEEE3getEv()|0);
 $3 = (__ZN12_GLOBAL__N_118getTypedArrayIndexIeEENS_15TypedArrayIndexEv()|0);
 $4 = $1;
 __embind_register_memory_view(($2|0),($3|0),($4|0));
 STACKTOP = sp;return;
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIeEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIeEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIeEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 7;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIeEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2568|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIdEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIdEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIdEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 7;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIdEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2576|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIfEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIfEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIfEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 6;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIfEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2584|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewImEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewImEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexImEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 5;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewImEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2592|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIlEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIlEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIlEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 4;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIlEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2600|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIjEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIjEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIjEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 5;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIjEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2608|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIiEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIiEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIiEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 4;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIiEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2616|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewItEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewItEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexItEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 3;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewItEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2624|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIsEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIsEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIsEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 2;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIsEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2632|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIhEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIhEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIhEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 1;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIhEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2640|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIaEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIaEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIaEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 0;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIaEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2648|0);
}
function __ZN10emscripten8internal6TypeIDINS_11memory_viewIcEEE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDINS_11memory_viewIcEEE3getEv()|0);
 return ($0|0);
}
function __ZN12_GLOBAL__N_118getTypedArrayIndexIcEENS_15TypedArrayIndexEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 0;
}
function __ZN10emscripten8internal11LightTypeIDINS_11memory_viewIcEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2656|0);
}
function __ZN10emscripten8internal11LightTypeIDINS_3valEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2560|0);
}
function __ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIwNS2_11char_traitsIwEENS2_9allocatorIwEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2664|0);
}
function __ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIhNS2_11char_traitsIhEENS2_9allocatorIhEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2688|0);
}
function __ZN10emscripten8internal11LightTypeIDINSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEEE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2448|0);
}
function __ZN10emscripten8internal6TypeIDIdE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIdE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIdE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2960|0);
}
function __ZN10emscripten8internal6TypeIDIfE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIfE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIfE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2952|0);
}
function __ZN10emscripten8internal6TypeIDImE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDImE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDImE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2944|0);
}
function __ZN10emscripten8internal6TypeIDIlE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIlE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIlE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2936|0);
}
function __ZN10emscripten8internal6TypeIDIjE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIjE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIjE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2928|0);
}
function __ZN10emscripten8internal6TypeIDItE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDItE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDItE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2912|0);
}
function __ZN10emscripten8internal6TypeIDIsE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIsE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIsE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2904|0);
}
function __ZN10emscripten8internal6TypeIDIhE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIhE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIhE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2888|0);
}
function __ZN10emscripten8internal6TypeIDIaE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIaE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIaE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2896|0);
}
function __ZN10emscripten8internal6TypeIDIcE3getEv() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__ZN10emscripten8internal11LightTypeIDIcE3getEv()|0);
 return ($0|0);
}
function __ZN10emscripten8internal11LightTypeIDIcE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2880|0);
}
function __ZN10emscripten8internal11LightTypeIDIbE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2872|0);
}
function __ZN10emscripten8internal11LightTypeIDIvE3getEv() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (2856|0);
}
function ___getTypeName($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $2;
 $1 = $3;
 $4 = $1;
 $5 = ((($4)) + 4|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (___strdup($6)|0);
 STACKTOP = sp;return ($7|0);
}
function ___stdio_close($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 $1 = ((($0)) + 60|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (_dummy_723($2)|0);
 HEAP32[$vararg_buffer>>2] = $3;
 $4 = (___syscall6(6,($vararg_buffer|0))|0);
 $5 = (___syscall_ret($4)|0);
 STACKTOP = sp;return ($5|0);
}
function ___stdio_write($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $$04756 = 0, $$04855 = 0, $$04954 = 0, $$051 = 0, $$1 = 0, $$150 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer3 = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0;
 var $vararg_ptr6 = 0, $vararg_ptr7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $vararg_buffer3 = sp + 32|0;
 $vararg_buffer = sp + 16|0;
 $3 = sp;
 $4 = ((($0)) + 28|0);
 $5 = HEAP32[$4>>2]|0;
 HEAP32[$3>>2] = $5;
 $6 = ((($3)) + 4|0);
 $7 = ((($0)) + 20|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = (($8) - ($5))|0;
 HEAP32[$6>>2] = $9;
 $10 = ((($3)) + 8|0);
 HEAP32[$10>>2] = $1;
 $11 = ((($3)) + 12|0);
 HEAP32[$11>>2] = $2;
 $12 = (($9) + ($2))|0;
 $13 = ((($0)) + 60|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = $3;
 HEAP32[$vararg_buffer>>2] = $14;
 $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
 HEAP32[$vararg_ptr1>>2] = $15;
 $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
 HEAP32[$vararg_ptr2>>2] = 2;
 $16 = (___syscall146(146,($vararg_buffer|0))|0);
 $17 = (___syscall_ret($16)|0);
 $18 = ($12|0)==($17|0);
 L1: do {
  if ($18) {
   label = 3;
  } else {
   $$04756 = 2;$$04855 = $12;$$04954 = $3;$26 = $17;
   while(1) {
    $27 = ($26|0)<(0);
    if ($27) {
     break;
    }
    $35 = (($$04855) - ($26))|0;
    $36 = ((($$04954)) + 4|0);
    $37 = HEAP32[$36>>2]|0;
    $38 = ($26>>>0)>($37>>>0);
    $39 = ((($$04954)) + 8|0);
    $$150 = $38 ? $39 : $$04954;
    $40 = $38 << 31 >> 31;
    $$1 = (($$04756) + ($40))|0;
    $41 = $38 ? $37 : 0;
    $$0 = (($26) - ($41))|0;
    $42 = HEAP32[$$150>>2]|0;
    $43 = (($42) + ($$0)|0);
    HEAP32[$$150>>2] = $43;
    $44 = ((($$150)) + 4|0);
    $45 = HEAP32[$44>>2]|0;
    $46 = (($45) - ($$0))|0;
    HEAP32[$44>>2] = $46;
    $47 = HEAP32[$13>>2]|0;
    $48 = $$150;
    HEAP32[$vararg_buffer3>>2] = $47;
    $vararg_ptr6 = ((($vararg_buffer3)) + 4|0);
    HEAP32[$vararg_ptr6>>2] = $48;
    $vararg_ptr7 = ((($vararg_buffer3)) + 8|0);
    HEAP32[$vararg_ptr7>>2] = $$1;
    $49 = (___syscall146(146,($vararg_buffer3|0))|0);
    $50 = (___syscall_ret($49)|0);
    $51 = ($35|0)==($50|0);
    if ($51) {
     label = 3;
     break L1;
    } else {
     $$04756 = $$1;$$04855 = $35;$$04954 = $$150;$26 = $50;
    }
   }
   $28 = ((($0)) + 16|0);
   HEAP32[$28>>2] = 0;
   HEAP32[$4>>2] = 0;
   HEAP32[$7>>2] = 0;
   $29 = HEAP32[$0>>2]|0;
   $30 = $29 | 32;
   HEAP32[$0>>2] = $30;
   $31 = ($$04756|0)==(2);
   if ($31) {
    $$051 = 0;
   } else {
    $32 = ((($$04954)) + 4|0);
    $33 = HEAP32[$32>>2]|0;
    $34 = (($2) - ($33))|0;
    $$051 = $34;
   }
  }
 } while(0);
 if ((label|0) == 3) {
  $19 = ((($0)) + 44|0);
  $20 = HEAP32[$19>>2]|0;
  $21 = ((($0)) + 48|0);
  $22 = HEAP32[$21>>2]|0;
  $23 = (($20) + ($22)|0);
  $24 = ((($0)) + 16|0);
  HEAP32[$24>>2] = $23;
  $25 = $20;
  HEAP32[$4>>2] = $25;
  HEAP32[$7>>2] = $25;
  $$051 = $2;
 }
 STACKTOP = sp;return ($$051|0);
}
function ___stdio_seek($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$pre = 0, $10 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, $vararg_ptr3 = 0, $vararg_ptr4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $vararg_buffer = sp;
 $3 = sp + 20|0;
 $4 = ((($0)) + 60|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $3;
 HEAP32[$vararg_buffer>>2] = $5;
 $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
 HEAP32[$vararg_ptr1>>2] = 0;
 $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
 HEAP32[$vararg_ptr2>>2] = $1;
 $vararg_ptr3 = ((($vararg_buffer)) + 12|0);
 HEAP32[$vararg_ptr3>>2] = $6;
 $vararg_ptr4 = ((($vararg_buffer)) + 16|0);
 HEAP32[$vararg_ptr4>>2] = $2;
 $7 = (___syscall140(140,($vararg_buffer|0))|0);
 $8 = (___syscall_ret($7)|0);
 $9 = ($8|0)<(0);
 if ($9) {
  HEAP32[$3>>2] = -1;
  $10 = -1;
 } else {
  $$pre = HEAP32[$3>>2]|0;
  $10 = $$pre;
 }
 STACKTOP = sp;return ($10|0);
}
function ___syscall_ret($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0>>>0)>(4294963200);
 if ($1) {
  $2 = (0 - ($0))|0;
  $3 = (___errno_location()|0);
  HEAP32[$3>>2] = $2;
  $$0 = -1;
 } else {
  $$0 = $0;
 }
 return ($$0|0);
}
function ___errno_location() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (7740|0);
}
function _dummy_723($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return ($0|0);
}
function ___stdout_write($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $vararg_buffer = sp;
 $3 = sp + 16|0;
 $4 = ((($0)) + 36|0);
 HEAP32[$4>>2] = 2;
 $5 = HEAP32[$0>>2]|0;
 $6 = $5 & 64;
 $7 = ($6|0)==(0);
 if ($7) {
  $8 = ((($0)) + 60|0);
  $9 = HEAP32[$8>>2]|0;
  $10 = $3;
  HEAP32[$vararg_buffer>>2] = $9;
  $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
  HEAP32[$vararg_ptr1>>2] = 21523;
  $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
  HEAP32[$vararg_ptr2>>2] = $10;
  $11 = (___syscall54(54,($vararg_buffer|0))|0);
  $12 = ($11|0)==(0);
  if (!($12)) {
   $13 = ((($0)) + 75|0);
   HEAP8[$13>>0] = -1;
  }
 }
 $14 = (___stdio_write($0,$1,$2)|0);
 STACKTOP = sp;return ($14|0);
}
function _strcmp($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$011 = 0, $$0710 = 0, $$lcssa = 0, $$lcssa8 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $2 = HEAP8[$0>>0]|0;
 $3 = HEAP8[$1>>0]|0;
 $4 = ($2<<24>>24)!=($3<<24>>24);
 $5 = ($2<<24>>24)==(0);
 $or$cond9 = $5 | $4;
 if ($or$cond9) {
  $$lcssa = $3;$$lcssa8 = $2;
 } else {
  $$011 = $1;$$0710 = $0;
  while(1) {
   $6 = ((($$0710)) + 1|0);
   $7 = ((($$011)) + 1|0);
   $8 = HEAP8[$6>>0]|0;
   $9 = HEAP8[$7>>0]|0;
   $10 = ($8<<24>>24)!=($9<<24>>24);
   $11 = ($8<<24>>24)==(0);
   $or$cond = $11 | $10;
   if ($or$cond) {
    $$lcssa = $9;$$lcssa8 = $8;
    break;
   } else {
    $$011 = $7;$$0710 = $6;
   }
  }
 }
 $12 = $$lcssa8&255;
 $13 = $$lcssa&255;
 $14 = (($12) - ($13))|0;
 return ($14|0);
}
function _isdigit($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($0) + -48)|0;
 $2 = ($1>>>0)<(10);
 $3 = $2&1;
 return ($3|0);
}
function _vfprintf($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $$1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var $spec$select = 0, $spec$select41 = 0, $vacopy_currentptr = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(224|0);
 $3 = sp + 208|0;
 $4 = sp + 160|0;
 $5 = sp + 80|0;
 $6 = sp;
 dest=$4; stop=dest+40|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $vacopy_currentptr = HEAP32[$2>>2]|0;
 HEAP32[$3>>2] = $vacopy_currentptr;
 $7 = (_printf_core(0,$1,$3,$5,$4)|0);
 $8 = ($7|0)<(0);
 if ($8) {
  $$0 = -1;
 } else {
  $9 = ((($0)) + 76|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = ($10|0)>(-1);
  if ($11) {
   $12 = (___lockfile($0)|0);
   $39 = $12;
  } else {
   $39 = 0;
  }
  $13 = HEAP32[$0>>2]|0;
  $14 = $13 & 32;
  $15 = ((($0)) + 74|0);
  $16 = HEAP8[$15>>0]|0;
  $17 = ($16<<24>>24)<(1);
  if ($17) {
   $18 = $13 & -33;
   HEAP32[$0>>2] = $18;
  }
  $19 = ((($0)) + 48|0);
  $20 = HEAP32[$19>>2]|0;
  $21 = ($20|0)==(0);
  if ($21) {
   $23 = ((($0)) + 44|0);
   $24 = HEAP32[$23>>2]|0;
   HEAP32[$23>>2] = $6;
   $25 = ((($0)) + 28|0);
   HEAP32[$25>>2] = $6;
   $26 = ((($0)) + 20|0);
   HEAP32[$26>>2] = $6;
   HEAP32[$19>>2] = 80;
   $27 = ((($6)) + 80|0);
   $28 = ((($0)) + 16|0);
   HEAP32[$28>>2] = $27;
   $29 = (_printf_core($0,$1,$3,$5,$4)|0);
   $30 = ($24|0)==(0|0);
   if ($30) {
    $$1 = $29;
   } else {
    $31 = ((($0)) + 36|0);
    $32 = HEAP32[$31>>2]|0;
    (FUNCTION_TABLE_iiii[$32 & 63]($0,0,0)|0);
    $33 = HEAP32[$26>>2]|0;
    $34 = ($33|0)==(0|0);
    $spec$select = $34 ? -1 : $29;
    HEAP32[$23>>2] = $24;
    HEAP32[$19>>2] = 0;
    HEAP32[$28>>2] = 0;
    HEAP32[$25>>2] = 0;
    HEAP32[$26>>2] = 0;
    $$1 = $spec$select;
   }
  } else {
   $22 = (_printf_core($0,$1,$3,$5,$4)|0);
   $$1 = $22;
  }
  $35 = HEAP32[$0>>2]|0;
  $36 = $35 & 32;
  $37 = ($36|0)==(0);
  $spec$select41 = $37 ? $$1 : -1;
  $38 = $35 | $14;
  HEAP32[$0>>2] = $38;
  $40 = ($39|0)==(0);
  if (!($40)) {
   ___unlockfile($0);
  }
  $$0 = $spec$select41;
 }
 STACKTOP = sp;return ($$0|0);
}
function _printf_core($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$ = 0, $$0 = 0, $$0228 = 0, $$0229334 = 0, $$0232 = 0, $$0235 = 0, $$0237 = 0, $$0240313 = 0, $$0240313371 = 0, $$0240333 = 0, $$0243 = 0, $$0243$ph = 0, $$0243$ph$be = 0, $$0247 = 0, $$0247$ph = 0, $$0249$lcssa = 0, $$0249321 = 0, $$0252 = 0, $$0253 = 0, $$0254 = 0;
 var $$0259 = 0, $$0262$lcssa = 0, $$0262328 = 0, $$0269$ph = 0, $$1 = 0, $$1230340 = 0, $$1233 = 0, $$1236 = 0, $$1238 = 0, $$1241339 = 0, $$1248 = 0, $$1250 = 0, $$1255 = 0, $$1260 = 0, $$1263 = 0, $$1270 = 0, $$2 = 0, $$2234 = 0, $$2239 = 0, $$2242320 = 0;
 var $$2256 = 0, $$2256$ = 0, $$2261 = 0, $$2271 = 0, $$3257 = 0, $$3265 = 0, $$3272 = 0, $$3317 = 0, $$4258370 = 0, $$4266 = 0, $$5 = 0, $$6268 = 0, $$lcssa308 = 0, $$pre = 0, $$pre$phiZ2D = 0, $$pre360 = 0, $$pre362 = 0, $$pre363 = 0, $$pre363$pre = 0, $$pre364 = 0;
 var $$pre368 = 0, $$sink = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0;
 var $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0;
 var $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0;
 var $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0;
 var $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0;
 var $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0;
 var $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0;
 var $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0;
 var $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0;
 var $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0;
 var $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0;
 var $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0;
 var $334 = 0, $335 = 0, $336 = 0.0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0;
 var $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0;
 var $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $arglist_current = 0, $arglist_current2 = 0, $arglist_next = 0;
 var $arglist_next3 = 0, $brmerge = 0, $brmerge326 = 0, $expanded = 0, $expanded10 = 0, $expanded11 = 0, $expanded13 = 0, $expanded14 = 0, $expanded15 = 0, $expanded4 = 0, $expanded6 = 0, $expanded7 = 0, $expanded8 = 0, $or$cond = 0, $or$cond276 = 0, $or$cond278 = 0, $or$cond283 = 0, $spec$select = 0, $spec$select281 = 0, $spec$select284 = 0;
 var $spec$select291 = 0, $spec$select292 = 0, $spec$select293 = 0, $spec$select294 = 0, $spec$select295 = 0, $spec$select296 = 0, $spec$select297 = 0, $spec$select298 = 0, $spec$select299 = 0, $storemerge273$lcssa = 0, $storemerge273327 = 0, $storemerge274 = 0, $trunc = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $5 = sp + 56|0;
 $6 = sp + 40|0;
 $7 = sp;
 $8 = sp + 48|0;
 $9 = sp + 60|0;
 HEAP32[$5>>2] = $1;
 $10 = ($0|0)!=(0|0);
 $11 = ((($7)) + 40|0);
 $12 = $11;
 $13 = ((($7)) + 39|0);
 $14 = ((($8)) + 4|0);
 $$0243$ph = 0;$$0247$ph = 0;$$0269$ph = 0;
 L1: while(1) {
  $$0243 = $$0243$ph;$$0247 = $$0247$ph;
  while(1) {
   $15 = ($$0247|0)>(-1);
   do {
    if ($15) {
     $16 = (2147483647 - ($$0247))|0;
     $17 = ($$0243|0)>($16|0);
     if ($17) {
      $18 = (___errno_location()|0);
      HEAP32[$18>>2] = 75;
      $$1248 = -1;
      break;
     } else {
      $19 = (($$0243) + ($$0247))|0;
      $$1248 = $19;
      break;
     }
    } else {
     $$1248 = $$0247;
    }
   } while(0);
   $20 = HEAP32[$5>>2]|0;
   $21 = HEAP8[$20>>0]|0;
   $22 = ($21<<24>>24)==(0);
   if ($22) {
    label = 94;
    break L1;
   }
   $23 = $21;$25 = $20;
   L12: while(1) {
    switch ($23<<24>>24) {
    case 37:  {
     label = 10;
     break L12;
     break;
    }
    case 0:  {
     $$0249$lcssa = $25;
     break L12;
     break;
    }
    default: {
    }
    }
    $24 = ((($25)) + 1|0);
    HEAP32[$5>>2] = $24;
    $$pre = HEAP8[$24>>0]|0;
    $23 = $$pre;$25 = $24;
   }
   L15: do {
    if ((label|0) == 10) {
     label = 0;
     $$0249321 = $25;$27 = $25;
     while(1) {
      $26 = ((($27)) + 1|0);
      $28 = HEAP8[$26>>0]|0;
      $29 = ($28<<24>>24)==(37);
      if (!($29)) {
       $$0249$lcssa = $$0249321;
       break L15;
      }
      $30 = ((($$0249321)) + 1|0);
      $31 = ((($27)) + 2|0);
      HEAP32[$5>>2] = $31;
      $32 = HEAP8[$31>>0]|0;
      $33 = ($32<<24>>24)==(37);
      if ($33) {
       $$0249321 = $30;$27 = $31;
      } else {
       $$0249$lcssa = $30;
       break;
      }
     }
    }
   } while(0);
   $34 = $$0249$lcssa;
   $35 = $20;
   $36 = (($34) - ($35))|0;
   if ($10) {
    _out($0,$20,$36);
   }
   $37 = ($36|0)==(0);
   if ($37) {
    break;
   } else {
    $$0243 = $36;$$0247 = $$1248;
   }
  }
  $38 = HEAP32[$5>>2]|0;
  $39 = ((($38)) + 1|0);
  $40 = HEAP8[$39>>0]|0;
  $41 = $40 << 24 >> 24;
  $42 = (_isdigit($41)|0);
  $43 = ($42|0)==(0);
  $$pre360 = HEAP32[$5>>2]|0;
  if ($43) {
   $$0253 = -1;$$1270 = $$0269$ph;$$sink = 1;
  } else {
   $44 = ((($$pre360)) + 2|0);
   $45 = HEAP8[$44>>0]|0;
   $46 = ($45<<24>>24)==(36);
   if ($46) {
    $47 = ((($$pre360)) + 1|0);
    $48 = HEAP8[$47>>0]|0;
    $49 = $48 << 24 >> 24;
    $50 = (($49) + -48)|0;
    $$0253 = $50;$$1270 = 1;$$sink = 3;
   } else {
    $$0253 = -1;$$1270 = $$0269$ph;$$sink = 1;
   }
  }
  $51 = (($$pre360) + ($$sink)|0);
  HEAP32[$5>>2] = $51;
  $52 = HEAP8[$51>>0]|0;
  $53 = $52 << 24 >> 24;
  $54 = (($53) + -32)|0;
  $55 = ($54>>>0)>(31);
  $56 = 1 << $54;
  $57 = $56 & 75913;
  $58 = ($57|0)==(0);
  $brmerge326 = $55 | $58;
  if ($brmerge326) {
   $$0262$lcssa = 0;$$lcssa308 = $52;$storemerge273$lcssa = $51;
  } else {
   $$0262328 = 0;$60 = $54;$storemerge273327 = $51;
   while(1) {
    $59 = 1 << $60;
    $61 = $59 | $$0262328;
    $62 = ((($storemerge273327)) + 1|0);
    HEAP32[$5>>2] = $62;
    $63 = HEAP8[$62>>0]|0;
    $64 = $63 << 24 >> 24;
    $65 = (($64) + -32)|0;
    $66 = ($65>>>0)>(31);
    $67 = 1 << $65;
    $68 = $67 & 75913;
    $69 = ($68|0)==(0);
    $brmerge = $66 | $69;
    if ($brmerge) {
     $$0262$lcssa = $61;$$lcssa308 = $63;$storemerge273$lcssa = $62;
     break;
    } else {
     $$0262328 = $61;$60 = $65;$storemerge273327 = $62;
    }
   }
  }
  $70 = ($$lcssa308<<24>>24)==(42);
  if ($70) {
   $71 = ((($storemerge273$lcssa)) + 1|0);
   $72 = HEAP8[$71>>0]|0;
   $73 = $72 << 24 >> 24;
   $74 = (_isdigit($73)|0);
   $75 = ($74|0)==(0);
   if ($75) {
    label = 27;
   } else {
    $76 = HEAP32[$5>>2]|0;
    $77 = ((($76)) + 2|0);
    $78 = HEAP8[$77>>0]|0;
    $79 = ($78<<24>>24)==(36);
    if ($79) {
     $80 = ((($76)) + 1|0);
     $81 = HEAP8[$80>>0]|0;
     $82 = $81 << 24 >> 24;
     $83 = (($82) + -48)|0;
     $84 = (($4) + ($83<<2)|0);
     HEAP32[$84>>2] = 10;
     $85 = HEAP8[$80>>0]|0;
     $86 = $85 << 24 >> 24;
     $87 = (($86) + -48)|0;
     $88 = (($3) + ($87<<3)|0);
     $89 = $88;
     $90 = $89;
     $91 = HEAP32[$90>>2]|0;
     $92 = (($89) + 4)|0;
     $93 = $92;
     $94 = HEAP32[$93>>2]|0;
     $95 = ((($76)) + 3|0);
     $$0259 = $91;$$2271 = 1;$storemerge274 = $95;
    } else {
     label = 27;
    }
   }
   if ((label|0) == 27) {
    label = 0;
    $96 = ($$1270|0)==(0);
    if (!($96)) {
     $$0 = -1;
     break;
    }
    if ($10) {
     $arglist_current = HEAP32[$2>>2]|0;
     $97 = $arglist_current;
     $98 = ((0) + 4|0);
     $expanded4 = $98;
     $expanded = (($expanded4) - 1)|0;
     $99 = (($97) + ($expanded))|0;
     $100 = ((0) + 4|0);
     $expanded8 = $100;
     $expanded7 = (($expanded8) - 1)|0;
     $expanded6 = $expanded7 ^ -1;
     $101 = $99 & $expanded6;
     $102 = $101;
     $103 = HEAP32[$102>>2]|0;
     $arglist_next = ((($102)) + 4|0);
     HEAP32[$2>>2] = $arglist_next;
     $358 = $103;
    } else {
     $358 = 0;
    }
    $104 = HEAP32[$5>>2]|0;
    $105 = ((($104)) + 1|0);
    $$0259 = $358;$$2271 = 0;$storemerge274 = $105;
   }
   HEAP32[$5>>2] = $storemerge274;
   $106 = ($$0259|0)<(0);
   $107 = $$0262$lcssa | 8192;
   $108 = (0 - ($$0259))|0;
   $spec$select291 = $106 ? $107 : $$0262$lcssa;
   $spec$select292 = $106 ? $108 : $$0259;
   $$1260 = $spec$select292;$$1263 = $spec$select291;$$3272 = $$2271;$112 = $storemerge274;
  } else {
   $109 = (_getint($5)|0);
   $110 = ($109|0)<(0);
   if ($110) {
    $$0 = -1;
    break;
   }
   $$pre362 = HEAP32[$5>>2]|0;
   $$1260 = $109;$$1263 = $$0262$lcssa;$$3272 = $$1270;$112 = $$pre362;
  }
  $111 = HEAP8[$112>>0]|0;
  $113 = ($111<<24>>24)==(46);
  do {
   if ($113) {
    $114 = ((($112)) + 1|0);
    $115 = HEAP8[$114>>0]|0;
    $116 = ($115<<24>>24)==(42);
    if (!($116)) {
     HEAP32[$5>>2] = $114;
     $152 = (_getint($5)|0);
     $$pre363$pre = HEAP32[$5>>2]|0;
     $$0254 = $152;$$pre363 = $$pre363$pre;
     break;
    }
    $117 = ((($112)) + 2|0);
    $118 = HEAP8[$117>>0]|0;
    $119 = $118 << 24 >> 24;
    $120 = (_isdigit($119)|0);
    $121 = ($120|0)==(0);
    if (!($121)) {
     $122 = HEAP32[$5>>2]|0;
     $123 = ((($122)) + 3|0);
     $124 = HEAP8[$123>>0]|0;
     $125 = ($124<<24>>24)==(36);
     if ($125) {
      $126 = ((($122)) + 2|0);
      $127 = HEAP8[$126>>0]|0;
      $128 = $127 << 24 >> 24;
      $129 = (($128) + -48)|0;
      $130 = (($4) + ($129<<2)|0);
      HEAP32[$130>>2] = 10;
      $131 = HEAP8[$126>>0]|0;
      $132 = $131 << 24 >> 24;
      $133 = (($132) + -48)|0;
      $134 = (($3) + ($133<<3)|0);
      $135 = $134;
      $136 = $135;
      $137 = HEAP32[$136>>2]|0;
      $138 = (($135) + 4)|0;
      $139 = $138;
      $140 = HEAP32[$139>>2]|0;
      $141 = ((($122)) + 4|0);
      HEAP32[$5>>2] = $141;
      $$0254 = $137;$$pre363 = $141;
      break;
     }
    }
    $142 = ($$3272|0)==(0);
    if (!($142)) {
     $$0 = -1;
     break L1;
    }
    if ($10) {
     $arglist_current2 = HEAP32[$2>>2]|0;
     $143 = $arglist_current2;
     $144 = ((0) + 4|0);
     $expanded11 = $144;
     $expanded10 = (($expanded11) - 1)|0;
     $145 = (($143) + ($expanded10))|0;
     $146 = ((0) + 4|0);
     $expanded15 = $146;
     $expanded14 = (($expanded15) - 1)|0;
     $expanded13 = $expanded14 ^ -1;
     $147 = $145 & $expanded13;
     $148 = $147;
     $149 = HEAP32[$148>>2]|0;
     $arglist_next3 = ((($148)) + 4|0);
     HEAP32[$2>>2] = $arglist_next3;
     $359 = $149;
    } else {
     $359 = 0;
    }
    $150 = HEAP32[$5>>2]|0;
    $151 = ((($150)) + 2|0);
    HEAP32[$5>>2] = $151;
    $$0254 = $359;$$pre363 = $151;
   } else {
    $$0254 = -1;$$pre363 = $112;
   }
  } while(0);
  $$0252 = 0;$154 = $$pre363;
  while(1) {
   $153 = HEAP8[$154>>0]|0;
   $155 = $153 << 24 >> 24;
   $156 = (($155) + -65)|0;
   $157 = ($156>>>0)>(57);
   if ($157) {
    $$0 = -1;
    break L1;
   }
   $158 = ((($154)) + 1|0);
   HEAP32[$5>>2] = $158;
   $159 = HEAP8[$154>>0]|0;
   $160 = $159 << 24 >> 24;
   $161 = (($160) + -65)|0;
   $162 = ((48 + (($$0252*58)|0)|0) + ($161)|0);
   $163 = HEAP8[$162>>0]|0;
   $164 = $163&255;
   $165 = (($164) + -1)|0;
   $166 = ($165>>>0)<(8);
   if ($166) {
    $$0252 = $164;$154 = $158;
   } else {
    break;
   }
  }
  $167 = ($163<<24>>24)==(0);
  if ($167) {
   $$0 = -1;
   break;
  }
  $168 = ($163<<24>>24)==(19);
  $169 = ($$0253|0)>(-1);
  do {
   if ($168) {
    if ($169) {
     $$0 = -1;
     break L1;
    } else {
     label = 54;
    }
   } else {
    if ($169) {
     $170 = (($4) + ($$0253<<2)|0);
     HEAP32[$170>>2] = $164;
     $171 = (($3) + ($$0253<<3)|0);
     $172 = $171;
     $173 = $172;
     $174 = HEAP32[$173>>2]|0;
     $175 = (($172) + 4)|0;
     $176 = $175;
     $177 = HEAP32[$176>>2]|0;
     $178 = $6;
     $179 = $178;
     HEAP32[$179>>2] = $174;
     $180 = (($178) + 4)|0;
     $181 = $180;
     HEAP32[$181>>2] = $177;
     label = 54;
     break;
    }
    if (!($10)) {
     $$0 = 0;
     break L1;
    }
    _pop_arg($6,$164,$2);
    $$pre364 = HEAP32[$5>>2]|0;
    $183 = $$pre364;
    label = 55;
   }
  } while(0);
  if ((label|0) == 54) {
   label = 0;
   if ($10) {
    $183 = $158;
    label = 55;
   } else {
    $$0243$ph$be = 0;
   }
  }
  L77: do {
   if ((label|0) == 55) {
    label = 0;
    $182 = ((($183)) + -1|0);
    $184 = HEAP8[$182>>0]|0;
    $185 = $184 << 24 >> 24;
    $186 = ($$0252|0)!=(0);
    $187 = $185 & 15;
    $188 = ($187|0)==(3);
    $or$cond276 = $186 & $188;
    $189 = $185 & -33;
    $$0235 = $or$cond276 ? $189 : $185;
    $190 = $$1263 & 8192;
    $191 = ($190|0)==(0);
    $192 = $$1263 & -65537;
    $spec$select = $191 ? $$1263 : $192;
    L79: do {
     switch ($$0235|0) {
     case 110:  {
      $trunc = $$0252&255;
      switch ($trunc<<24>>24) {
      case 0:  {
       $199 = HEAP32[$6>>2]|0;
       HEAP32[$199>>2] = $$1248;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 1:  {
       $200 = HEAP32[$6>>2]|0;
       HEAP32[$200>>2] = $$1248;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 2:  {
       $201 = ($$1248|0)<(0);
       $202 = $201 << 31 >> 31;
       $203 = HEAP32[$6>>2]|0;
       $204 = $203;
       $205 = $204;
       HEAP32[$205>>2] = $$1248;
       $206 = (($204) + 4)|0;
       $207 = $206;
       HEAP32[$207>>2] = $202;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 3:  {
       $208 = $$1248&65535;
       $209 = HEAP32[$6>>2]|0;
       HEAP16[$209>>1] = $208;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 4:  {
       $210 = $$1248&255;
       $211 = HEAP32[$6>>2]|0;
       HEAP8[$211>>0] = $210;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 6:  {
       $212 = HEAP32[$6>>2]|0;
       HEAP32[$212>>2] = $$1248;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      case 7:  {
       $213 = ($$1248|0)<(0);
       $214 = $213 << 31 >> 31;
       $215 = HEAP32[$6>>2]|0;
       $216 = $215;
       $217 = $216;
       HEAP32[$217>>2] = $$1248;
       $218 = (($216) + 4)|0;
       $219 = $218;
       HEAP32[$219>>2] = $214;
       $$0243$ph$be = 0;
       break L77;
       break;
      }
      default: {
       $$0243$ph$be = 0;
       break L77;
      }
      }
      break;
     }
     case 112:  {
      $220 = ($$0254>>>0)>(8);
      $221 = $220 ? $$0254 : 8;
      $222 = $spec$select | 8;
      $$1236 = 120;$$1255 = $221;$$3265 = $222;
      label = 67;
      break;
     }
     case 88: case 120:  {
      $$1236 = $$0235;$$1255 = $$0254;$$3265 = $spec$select;
      label = 67;
      break;
     }
     case 111:  {
      $238 = $6;
      $239 = $238;
      $240 = HEAP32[$239>>2]|0;
      $241 = (($238) + 4)|0;
      $242 = $241;
      $243 = HEAP32[$242>>2]|0;
      $244 = (_fmt_o($240,$243,$11)|0);
      $245 = $spec$select & 8;
      $246 = ($245|0)==(0);
      $247 = $244;
      $248 = (($12) - ($247))|0;
      $249 = ($$0254|0)>($248|0);
      $250 = (($248) + 1)|0;
      $251 = $246 | $249;
      $spec$select295 = $251 ? $$0254 : $250;
      $$0228 = $244;$$1233 = 0;$$1238 = 5886;$$2256 = $spec$select295;$$4266 = $spec$select;$276 = $240;$278 = $243;
      label = 73;
      break;
     }
     case 105: case 100:  {
      $252 = $6;
      $253 = $252;
      $254 = HEAP32[$253>>2]|0;
      $255 = (($252) + 4)|0;
      $256 = $255;
      $257 = HEAP32[$256>>2]|0;
      $258 = ($257|0)<(0);
      if ($258) {
       $259 = (_i64Subtract(0,0,($254|0),($257|0))|0);
       $260 = (getTempRet0() | 0);
       $261 = $6;
       $262 = $261;
       HEAP32[$262>>2] = $259;
       $263 = (($261) + 4)|0;
       $264 = $263;
       HEAP32[$264>>2] = $260;
       $$0232 = 1;$$0237 = 5886;$271 = $259;$272 = $260;
       label = 72;
       break L79;
      } else {
       $265 = $spec$select & 2048;
       $266 = ($265|0)==(0);
       $267 = $spec$select & 1;
       $268 = ($267|0)==(0);
       $$ = $268 ? 5886 : (5888);
       $spec$select296 = $266 ? $$ : (5887);
       $269 = $spec$select & 2049;
       $270 = ($269|0)!=(0);
       $spec$select297 = $270&1;
       $$0232 = $spec$select297;$$0237 = $spec$select296;$271 = $254;$272 = $257;
       label = 72;
       break L79;
      }
      break;
     }
     case 117:  {
      $193 = $6;
      $194 = $193;
      $195 = HEAP32[$194>>2]|0;
      $196 = (($193) + 4)|0;
      $197 = $196;
      $198 = HEAP32[$197>>2]|0;
      $$0232 = 0;$$0237 = 5886;$271 = $195;$272 = $198;
      label = 72;
      break;
     }
     case 99:  {
      $288 = $6;
      $289 = $288;
      $290 = HEAP32[$289>>2]|0;
      $291 = (($288) + 4)|0;
      $292 = $291;
      $293 = HEAP32[$292>>2]|0;
      $294 = $290&255;
      HEAP8[$13>>0] = $294;
      $$2 = $13;$$2234 = 0;$$2239 = 5886;$$5 = 1;$$6268 = $192;$$pre$phiZ2D = $12;
      break;
     }
     case 109:  {
      $295 = (___errno_location()|0);
      $296 = HEAP32[$295>>2]|0;
      $297 = (_strerror($296)|0);
      $$1 = $297;
      label = 77;
      break;
     }
     case 115:  {
      $298 = HEAP32[$6>>2]|0;
      $299 = ($298|0)==(0|0);
      $300 = $299 ? 5896 : $298;
      $$1 = $300;
      label = 77;
      break;
     }
     case 67:  {
      $307 = $6;
      $308 = $307;
      $309 = HEAP32[$308>>2]|0;
      $310 = (($307) + 4)|0;
      $311 = $310;
      $312 = HEAP32[$311>>2]|0;
      HEAP32[$8>>2] = $309;
      HEAP32[$14>>2] = 0;
      HEAP32[$6>>2] = $8;
      $$4258370 = -1;
      label = 81;
      break;
     }
     case 83:  {
      $313 = ($$0254|0)==(0);
      if ($313) {
       _pad_661($0,32,$$1260,0,$spec$select);
       $$0240313371 = 0;
       label = 91;
      } else {
       $$4258370 = $$0254;
       label = 81;
      }
      break;
     }
     case 65: case 71: case 70: case 69: case 97: case 103: case 102: case 101:  {
      $336 = +HEAPF64[$6>>3];
      $337 = (_fmt_fp($0,$336,$$1260,$$0254,$spec$select,$$0235)|0);
      $$0243$ph$be = $337;
      break L77;
      break;
     }
     default: {
      $$2 = $20;$$2234 = 0;$$2239 = 5886;$$5 = $$0254;$$6268 = $spec$select;$$pre$phiZ2D = $12;
     }
     }
    } while(0);
    L103: do {
     if ((label|0) == 67) {
      label = 0;
      $223 = $6;
      $224 = $223;
      $225 = HEAP32[$224>>2]|0;
      $226 = (($223) + 4)|0;
      $227 = $226;
      $228 = HEAP32[$227>>2]|0;
      $229 = $$1236 & 32;
      $230 = (_fmt_x($225,$228,$11,$229)|0);
      $231 = ($225|0)==(0);
      $232 = ($228|0)==(0);
      $233 = $231 & $232;
      $234 = $$3265 & 8;
      $235 = ($234|0)==(0);
      $or$cond278 = $235 | $233;
      $236 = $$1236 >>> 4;
      $237 = (5886 + ($236)|0);
      $spec$select293 = $or$cond278 ? 5886 : $237;
      $spec$select294 = $or$cond278 ? 0 : 2;
      $$0228 = $230;$$1233 = $spec$select294;$$1238 = $spec$select293;$$2256 = $$1255;$$4266 = $$3265;$276 = $225;$278 = $228;
      label = 73;
     }
     else if ((label|0) == 72) {
      label = 0;
      $273 = (_fmt_u($271,$272,$11)|0);
      $$0228 = $273;$$1233 = $$0232;$$1238 = $$0237;$$2256 = $$0254;$$4266 = $spec$select;$276 = $271;$278 = $272;
      label = 73;
     }
     else if ((label|0) == 77) {
      label = 0;
      $301 = (_memchr($$1,0,$$0254)|0);
      $302 = ($301|0)==(0|0);
      $303 = $301;
      $304 = $$1;
      $305 = (($303) - ($304))|0;
      $306 = (($$1) + ($$0254)|0);
      $$3257 = $302 ? $$0254 : $305;
      $$1250 = $302 ? $306 : $301;
      $$pre368 = $$1250;
      $$2 = $$1;$$2234 = 0;$$2239 = 5886;$$5 = $$3257;$$6268 = $192;$$pre$phiZ2D = $$pre368;
     }
     else if ((label|0) == 81) {
      label = 0;
      $314 = HEAP32[$6>>2]|0;
      $$0229334 = $314;$$0240333 = 0;
      while(1) {
       $315 = HEAP32[$$0229334>>2]|0;
       $316 = ($315|0)==(0);
       if ($316) {
        $$0240313 = $$0240333;
        break;
       }
       $317 = (_wctomb($9,$315)|0);
       $318 = ($317|0)<(0);
       $319 = (($$4258370) - ($$0240333))|0;
       $320 = ($317>>>0)>($319>>>0);
       $or$cond283 = $318 | $320;
       if ($or$cond283) {
        label = 85;
        break;
       }
       $321 = ((($$0229334)) + 4|0);
       $322 = (($317) + ($$0240333))|0;
       $323 = ($$4258370>>>0)>($322>>>0);
       if ($323) {
        $$0229334 = $321;$$0240333 = $322;
       } else {
        $$0240313 = $322;
        break;
       }
      }
      if ((label|0) == 85) {
       label = 0;
       if ($318) {
        $$0 = -1;
        break L1;
       } else {
        $$0240313 = $$0240333;
       }
      }
      _pad_661($0,32,$$1260,$$0240313,$spec$select);
      $324 = ($$0240313|0)==(0);
      if ($324) {
       $$0240313371 = 0;
       label = 91;
      } else {
       $325 = HEAP32[$6>>2]|0;
       $$1230340 = $325;$$1241339 = 0;
       while(1) {
        $326 = HEAP32[$$1230340>>2]|0;
        $327 = ($326|0)==(0);
        if ($327) {
         $$0240313371 = $$0240313;
         label = 91;
         break L103;
        }
        $328 = (_wctomb($9,$326)|0);
        $329 = (($328) + ($$1241339))|0;
        $330 = ($329|0)>($$0240313|0);
        if ($330) {
         $$0240313371 = $$0240313;
         label = 91;
         break L103;
        }
        $331 = ((($$1230340)) + 4|0);
        _out($0,$9,$328);
        $332 = ($329>>>0)<($$0240313>>>0);
        if ($332) {
         $$1230340 = $331;$$1241339 = $329;
        } else {
         $$0240313371 = $$0240313;
         label = 91;
         break;
        }
       }
      }
     }
    } while(0);
    if ((label|0) == 73) {
     label = 0;
     $274 = ($$2256|0)>(-1);
     $275 = $$4266 & -65537;
     $spec$select281 = $274 ? $275 : $$4266;
     $277 = ($276|0)!=(0);
     $279 = ($278|0)!=(0);
     $280 = $277 | $279;
     $281 = ($$2256|0)!=(0);
     $or$cond = $281 | $280;
     $282 = $$0228;
     $283 = (($12) - ($282))|0;
     $284 = $280 ^ 1;
     $285 = $284&1;
     $286 = (($283) + ($285))|0;
     $287 = ($$2256|0)>($286|0);
     $$2256$ = $287 ? $$2256 : $286;
     $spec$select298 = $or$cond ? $$2256$ : 0;
     $spec$select299 = $or$cond ? $$0228 : $11;
     $$2 = $spec$select299;$$2234 = $$1233;$$2239 = $$1238;$$5 = $spec$select298;$$6268 = $spec$select281;$$pre$phiZ2D = $12;
    }
    else if ((label|0) == 91) {
     label = 0;
     $333 = $spec$select ^ 8192;
     _pad_661($0,32,$$1260,$$0240313371,$333);
     $334 = ($$1260|0)>($$0240313371|0);
     $335 = $334 ? $$1260 : $$0240313371;
     $$0243$ph$be = $335;
     break;
    }
    $338 = $$2;
    $339 = (($$pre$phiZ2D) - ($338))|0;
    $340 = ($$5|0)<($339|0);
    $spec$select284 = $340 ? $339 : $$5;
    $341 = (($spec$select284) + ($$2234))|0;
    $342 = ($$1260|0)<($341|0);
    $$2261 = $342 ? $341 : $$1260;
    _pad_661($0,32,$$2261,$341,$$6268);
    _out($0,$$2239,$$2234);
    $343 = $$6268 ^ 65536;
    _pad_661($0,48,$$2261,$341,$343);
    _pad_661($0,48,$spec$select284,$339,0);
    _out($0,$$2,$339);
    $344 = $$6268 ^ 8192;
    _pad_661($0,32,$$2261,$341,$344);
    $$0243$ph$be = $$2261;
   }
  } while(0);
  $$0243$ph = $$0243$ph$be;$$0247$ph = $$1248;$$0269$ph = $$3272;
 }
 L125: do {
  if ((label|0) == 94) {
   $345 = ($0|0)==(0|0);
   if ($345) {
    $346 = ($$0269$ph|0)==(0);
    if ($346) {
     $$0 = 0;
    } else {
     $$2242320 = 1;
     while(1) {
      $347 = (($4) + ($$2242320<<2)|0);
      $348 = HEAP32[$347>>2]|0;
      $349 = ($348|0)==(0);
      if ($349) {
       break;
      }
      $350 = (($3) + ($$2242320<<3)|0);
      _pop_arg($350,$348,$2);
      $351 = (($$2242320) + 1)|0;
      $352 = ($351>>>0)<(10);
      if ($352) {
       $$2242320 = $351;
      } else {
       $$0 = 1;
       break L125;
      }
     }
     $$3317 = $$2242320;
     while(1) {
      $355 = (($4) + ($$3317<<2)|0);
      $356 = HEAP32[$355>>2]|0;
      $357 = ($356|0)==(0);
      $353 = (($$3317) + 1)|0;
      if (!($357)) {
       $$0 = -1;
       break L125;
      }
      $354 = ($353>>>0)<(10);
      if ($354) {
       $$3317 = $353;
      } else {
       $$0 = 1;
       break;
      }
     }
    }
   } else {
    $$0 = $$1248;
   }
  }
 } while(0);
 STACKTOP = sp;return ($$0|0);
}
function ___lockfile($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 1;
}
function ___unlockfile($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function _out($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = HEAP32[$0>>2]|0;
 $4 = $3 & 32;
 $5 = ($4|0)==(0);
 if ($5) {
  (___fwritex($1,$2,$0)|0);
 }
 return;
}
function _getint($0) {
 $0 = $0|0;
 var $$0$lcssa = 0, $$04 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[$0>>2]|0;
 $2 = HEAP8[$1>>0]|0;
 $3 = $2 << 24 >> 24;
 $4 = (_isdigit($3)|0);
 $5 = ($4|0)==(0);
 if ($5) {
  $$0$lcssa = 0;
 } else {
  $$04 = 0;
  while(1) {
   $6 = ($$04*10)|0;
   $7 = HEAP32[$0>>2]|0;
   $8 = HEAP8[$7>>0]|0;
   $9 = $8 << 24 >> 24;
   $10 = (($6) + -48)|0;
   $11 = (($10) + ($9))|0;
   $12 = ((($7)) + 1|0);
   HEAP32[$0>>2] = $12;
   $13 = HEAP8[$12>>0]|0;
   $14 = $13 << 24 >> 24;
   $15 = (_isdigit($14)|0);
   $16 = ($15|0)==(0);
   if ($16) {
    $$0$lcssa = $11;
    break;
   } else {
    $$04 = $11;
   }
  }
 }
 return ($$0$lcssa|0);
}
function _pop_arg($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$mask = 0, $$mask31 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0.0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0.0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $arglist_current = 0, $arglist_current11 = 0, $arglist_current14 = 0, $arglist_current17 = 0;
 var $arglist_current2 = 0, $arglist_current20 = 0, $arglist_current23 = 0, $arglist_current26 = 0, $arglist_current5 = 0, $arglist_current8 = 0, $arglist_next = 0, $arglist_next12 = 0, $arglist_next15 = 0, $arglist_next18 = 0, $arglist_next21 = 0, $arglist_next24 = 0, $arglist_next27 = 0, $arglist_next3 = 0, $arglist_next6 = 0, $arglist_next9 = 0, $expanded = 0, $expanded28 = 0, $expanded30 = 0, $expanded31 = 0;
 var $expanded32 = 0, $expanded34 = 0, $expanded35 = 0, $expanded37 = 0, $expanded38 = 0, $expanded39 = 0, $expanded41 = 0, $expanded42 = 0, $expanded44 = 0, $expanded45 = 0, $expanded46 = 0, $expanded48 = 0, $expanded49 = 0, $expanded51 = 0, $expanded52 = 0, $expanded53 = 0, $expanded55 = 0, $expanded56 = 0, $expanded58 = 0, $expanded59 = 0;
 var $expanded60 = 0, $expanded62 = 0, $expanded63 = 0, $expanded65 = 0, $expanded66 = 0, $expanded67 = 0, $expanded69 = 0, $expanded70 = 0, $expanded72 = 0, $expanded73 = 0, $expanded74 = 0, $expanded76 = 0, $expanded77 = 0, $expanded79 = 0, $expanded80 = 0, $expanded81 = 0, $expanded83 = 0, $expanded84 = 0, $expanded86 = 0, $expanded87 = 0;
 var $expanded88 = 0, $expanded90 = 0, $expanded91 = 0, $expanded93 = 0, $expanded94 = 0, $expanded95 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($1>>>0)>(20);
 L1: do {
  if (!($3)) {
   do {
    switch ($1|0) {
    case 9:  {
     $arglist_current = HEAP32[$2>>2]|0;
     $4 = $arglist_current;
     $5 = ((0) + 4|0);
     $expanded28 = $5;
     $expanded = (($expanded28) - 1)|0;
     $6 = (($4) + ($expanded))|0;
     $7 = ((0) + 4|0);
     $expanded32 = $7;
     $expanded31 = (($expanded32) - 1)|0;
     $expanded30 = $expanded31 ^ -1;
     $8 = $6 & $expanded30;
     $9 = $8;
     $10 = HEAP32[$9>>2]|0;
     $arglist_next = ((($9)) + 4|0);
     HEAP32[$2>>2] = $arglist_next;
     HEAP32[$0>>2] = $10;
     break L1;
     break;
    }
    case 10:  {
     $arglist_current2 = HEAP32[$2>>2]|0;
     $11 = $arglist_current2;
     $12 = ((0) + 4|0);
     $expanded35 = $12;
     $expanded34 = (($expanded35) - 1)|0;
     $13 = (($11) + ($expanded34))|0;
     $14 = ((0) + 4|0);
     $expanded39 = $14;
     $expanded38 = (($expanded39) - 1)|0;
     $expanded37 = $expanded38 ^ -1;
     $15 = $13 & $expanded37;
     $16 = $15;
     $17 = HEAP32[$16>>2]|0;
     $arglist_next3 = ((($16)) + 4|0);
     HEAP32[$2>>2] = $arglist_next3;
     $18 = ($17|0)<(0);
     $19 = $18 << 31 >> 31;
     $20 = $0;
     $21 = $20;
     HEAP32[$21>>2] = $17;
     $22 = (($20) + 4)|0;
     $23 = $22;
     HEAP32[$23>>2] = $19;
     break L1;
     break;
    }
    case 11:  {
     $arglist_current5 = HEAP32[$2>>2]|0;
     $24 = $arglist_current5;
     $25 = ((0) + 4|0);
     $expanded42 = $25;
     $expanded41 = (($expanded42) - 1)|0;
     $26 = (($24) + ($expanded41))|0;
     $27 = ((0) + 4|0);
     $expanded46 = $27;
     $expanded45 = (($expanded46) - 1)|0;
     $expanded44 = $expanded45 ^ -1;
     $28 = $26 & $expanded44;
     $29 = $28;
     $30 = HEAP32[$29>>2]|0;
     $arglist_next6 = ((($29)) + 4|0);
     HEAP32[$2>>2] = $arglist_next6;
     $31 = $0;
     $32 = $31;
     HEAP32[$32>>2] = $30;
     $33 = (($31) + 4)|0;
     $34 = $33;
     HEAP32[$34>>2] = 0;
     break L1;
     break;
    }
    case 12:  {
     $arglist_current8 = HEAP32[$2>>2]|0;
     $35 = $arglist_current8;
     $36 = ((0) + 8|0);
     $expanded49 = $36;
     $expanded48 = (($expanded49) - 1)|0;
     $37 = (($35) + ($expanded48))|0;
     $38 = ((0) + 8|0);
     $expanded53 = $38;
     $expanded52 = (($expanded53) - 1)|0;
     $expanded51 = $expanded52 ^ -1;
     $39 = $37 & $expanded51;
     $40 = $39;
     $41 = $40;
     $42 = $41;
     $43 = HEAP32[$42>>2]|0;
     $44 = (($41) + 4)|0;
     $45 = $44;
     $46 = HEAP32[$45>>2]|0;
     $arglist_next9 = ((($40)) + 8|0);
     HEAP32[$2>>2] = $arglist_next9;
     $47 = $0;
     $48 = $47;
     HEAP32[$48>>2] = $43;
     $49 = (($47) + 4)|0;
     $50 = $49;
     HEAP32[$50>>2] = $46;
     break L1;
     break;
    }
    case 13:  {
     $arglist_current11 = HEAP32[$2>>2]|0;
     $51 = $arglist_current11;
     $52 = ((0) + 4|0);
     $expanded56 = $52;
     $expanded55 = (($expanded56) - 1)|0;
     $53 = (($51) + ($expanded55))|0;
     $54 = ((0) + 4|0);
     $expanded60 = $54;
     $expanded59 = (($expanded60) - 1)|0;
     $expanded58 = $expanded59 ^ -1;
     $55 = $53 & $expanded58;
     $56 = $55;
     $57 = HEAP32[$56>>2]|0;
     $arglist_next12 = ((($56)) + 4|0);
     HEAP32[$2>>2] = $arglist_next12;
     $58 = $57&65535;
     $59 = $58 << 16 >> 16;
     $60 = ($59|0)<(0);
     $61 = $60 << 31 >> 31;
     $62 = $0;
     $63 = $62;
     HEAP32[$63>>2] = $59;
     $64 = (($62) + 4)|0;
     $65 = $64;
     HEAP32[$65>>2] = $61;
     break L1;
     break;
    }
    case 14:  {
     $arglist_current14 = HEAP32[$2>>2]|0;
     $66 = $arglist_current14;
     $67 = ((0) + 4|0);
     $expanded63 = $67;
     $expanded62 = (($expanded63) - 1)|0;
     $68 = (($66) + ($expanded62))|0;
     $69 = ((0) + 4|0);
     $expanded67 = $69;
     $expanded66 = (($expanded67) - 1)|0;
     $expanded65 = $expanded66 ^ -1;
     $70 = $68 & $expanded65;
     $71 = $70;
     $72 = HEAP32[$71>>2]|0;
     $arglist_next15 = ((($71)) + 4|0);
     HEAP32[$2>>2] = $arglist_next15;
     $$mask31 = $72 & 65535;
     $73 = $0;
     $74 = $73;
     HEAP32[$74>>2] = $$mask31;
     $75 = (($73) + 4)|0;
     $76 = $75;
     HEAP32[$76>>2] = 0;
     break L1;
     break;
    }
    case 15:  {
     $arglist_current17 = HEAP32[$2>>2]|0;
     $77 = $arglist_current17;
     $78 = ((0) + 4|0);
     $expanded70 = $78;
     $expanded69 = (($expanded70) - 1)|0;
     $79 = (($77) + ($expanded69))|0;
     $80 = ((0) + 4|0);
     $expanded74 = $80;
     $expanded73 = (($expanded74) - 1)|0;
     $expanded72 = $expanded73 ^ -1;
     $81 = $79 & $expanded72;
     $82 = $81;
     $83 = HEAP32[$82>>2]|0;
     $arglist_next18 = ((($82)) + 4|0);
     HEAP32[$2>>2] = $arglist_next18;
     $84 = $83&255;
     $85 = $84 << 24 >> 24;
     $86 = ($85|0)<(0);
     $87 = $86 << 31 >> 31;
     $88 = $0;
     $89 = $88;
     HEAP32[$89>>2] = $85;
     $90 = (($88) + 4)|0;
     $91 = $90;
     HEAP32[$91>>2] = $87;
     break L1;
     break;
    }
    case 16:  {
     $arglist_current20 = HEAP32[$2>>2]|0;
     $92 = $arglist_current20;
     $93 = ((0) + 4|0);
     $expanded77 = $93;
     $expanded76 = (($expanded77) - 1)|0;
     $94 = (($92) + ($expanded76))|0;
     $95 = ((0) + 4|0);
     $expanded81 = $95;
     $expanded80 = (($expanded81) - 1)|0;
     $expanded79 = $expanded80 ^ -1;
     $96 = $94 & $expanded79;
     $97 = $96;
     $98 = HEAP32[$97>>2]|0;
     $arglist_next21 = ((($97)) + 4|0);
     HEAP32[$2>>2] = $arglist_next21;
     $$mask = $98 & 255;
     $99 = $0;
     $100 = $99;
     HEAP32[$100>>2] = $$mask;
     $101 = (($99) + 4)|0;
     $102 = $101;
     HEAP32[$102>>2] = 0;
     break L1;
     break;
    }
    case 17:  {
     $arglist_current23 = HEAP32[$2>>2]|0;
     $103 = $arglist_current23;
     $104 = ((0) + 8|0);
     $expanded84 = $104;
     $expanded83 = (($expanded84) - 1)|0;
     $105 = (($103) + ($expanded83))|0;
     $106 = ((0) + 8|0);
     $expanded88 = $106;
     $expanded87 = (($expanded88) - 1)|0;
     $expanded86 = $expanded87 ^ -1;
     $107 = $105 & $expanded86;
     $108 = $107;
     $109 = +HEAPF64[$108>>3];
     $arglist_next24 = ((($108)) + 8|0);
     HEAP32[$2>>2] = $arglist_next24;
     HEAPF64[$0>>3] = $109;
     break L1;
     break;
    }
    case 18:  {
     $arglist_current26 = HEAP32[$2>>2]|0;
     $110 = $arglist_current26;
     $111 = ((0) + 8|0);
     $expanded91 = $111;
     $expanded90 = (($expanded91) - 1)|0;
     $112 = (($110) + ($expanded90))|0;
     $113 = ((0) + 8|0);
     $expanded95 = $113;
     $expanded94 = (($expanded95) - 1)|0;
     $expanded93 = $expanded94 ^ -1;
     $114 = $112 & $expanded93;
     $115 = $114;
     $116 = +HEAPF64[$115>>3];
     $arglist_next27 = ((($115)) + 8|0);
     HEAP32[$2>>2] = $arglist_next27;
     HEAPF64[$0>>3] = $116;
     break L1;
     break;
    }
    default: {
     break L1;
    }
    }
   } while(0);
  }
 } while(0);
 return;
}
function _fmt_x($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$05$lcssa = 0, $$056 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $4 = ($0|0)==(0);
 $5 = ($1|0)==(0);
 $6 = $4 & $5;
 if ($6) {
  $$05$lcssa = $2;
 } else {
  $$056 = $2;$15 = $1;$8 = $0;
  while(1) {
   $7 = $8 & 15;
   $9 = (512 + ($7)|0);
   $10 = HEAP8[$9>>0]|0;
   $11 = $10&255;
   $12 = $11 | $3;
   $13 = $12&255;
   $14 = ((($$056)) + -1|0);
   HEAP8[$14>>0] = $13;
   $16 = (_bitshift64Lshr(($8|0),($15|0),4)|0);
   $17 = (getTempRet0() | 0);
   $18 = ($16|0)==(0);
   $19 = ($17|0)==(0);
   $20 = $18 & $19;
   if ($20) {
    $$05$lcssa = $14;
    break;
   } else {
    $$056 = $14;$15 = $17;$8 = $16;
   }
  }
 }
 return ($$05$lcssa|0);
}
function _fmt_o($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0$lcssa = 0, $$06 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($0|0)==(0);
 $4 = ($1|0)==(0);
 $5 = $3 & $4;
 if ($5) {
  $$0$lcssa = $2;
 } else {
  $$06 = $2;$11 = $1;$7 = $0;
  while(1) {
   $6 = $7&255;
   $8 = $6 & 7;
   $9 = $8 | 48;
   $10 = ((($$06)) + -1|0);
   HEAP8[$10>>0] = $9;
   $12 = (_bitshift64Lshr(($7|0),($11|0),3)|0);
   $13 = (getTempRet0() | 0);
   $14 = ($12|0)==(0);
   $15 = ($13|0)==(0);
   $16 = $14 & $15;
   if ($16) {
    $$0$lcssa = $10;
    break;
   } else {
    $$06 = $10;$11 = $13;$7 = $12;
   }
  }
 }
 return ($$0$lcssa|0);
}
function _fmt_u($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$010$lcssa$off0 = 0, $$012 = 0, $$09$lcssa = 0, $$0914 = 0, $$1$lcssa = 0, $$111 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($1>>>0)>(0);
 $4 = ($0>>>0)>(4294967295);
 $5 = ($1|0)==(0);
 $6 = $5 & $4;
 $7 = $3 | $6;
 if ($7) {
  $$0914 = $2;$8 = $0;$9 = $1;
  while(1) {
   $10 = (___udivdi3(($8|0),($9|0),10,0)|0);
   $11 = (getTempRet0() | 0);
   $12 = (___muldi3(($10|0),($11|0),10,0)|0);
   $13 = (getTempRet0() | 0);
   $14 = (_i64Subtract(($8|0),($9|0),($12|0),($13|0))|0);
   $15 = (getTempRet0() | 0);
   $16 = $14&255;
   $17 = $16 | 48;
   $18 = ((($$0914)) + -1|0);
   HEAP8[$18>>0] = $17;
   $19 = ($9>>>0)>(9);
   $20 = ($8>>>0)>(4294967295);
   $21 = ($9|0)==(9);
   $22 = $21 & $20;
   $23 = $19 | $22;
   if ($23) {
    $$0914 = $18;$8 = $10;$9 = $11;
   } else {
    break;
   }
  }
  $$010$lcssa$off0 = $10;$$09$lcssa = $18;
 } else {
  $$010$lcssa$off0 = $0;$$09$lcssa = $2;
 }
 $24 = ($$010$lcssa$off0|0)==(0);
 if ($24) {
  $$1$lcssa = $$09$lcssa;
 } else {
  $$012 = $$010$lcssa$off0;$$111 = $$09$lcssa;
  while(1) {
   $25 = (($$012>>>0) / 10)&-1;
   $26 = ($25*10)|0;
   $27 = (($$012) - ($26))|0;
   $28 = $27 | 48;
   $29 = $28&255;
   $30 = ((($$111)) + -1|0);
   HEAP8[$30>>0] = $29;
   $31 = ($$012>>>0)<(10);
   if ($31) {
    $$1$lcssa = $30;
    break;
   } else {
    $$012 = $25;$$111 = $30;
   }
  }
 }
 return ($$1$lcssa|0);
}
function _strerror($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (___pthread_self_107()|0);
 $2 = ((($1)) + 188|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = (___strerror_l($0,$3)|0);
 return ($4|0);
}
function _memchr($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0$lcssa = 0, $$035$lcssa = 0, $$035$lcssa65 = 0, $$03555 = 0, $$036$lcssa = 0, $$036$lcssa64 = 0, $$03654 = 0, $$046 = 0, $$137$lcssa = 0, $$137$lcssa66 = 0, $$13745 = 0, $$140 = 0, $$23839 = 0, $$in = 0, $$lcssa = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0;
 var $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0;
 var $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond53 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = $1 & 255;
 $4 = $0;
 $5 = $4 & 3;
 $6 = ($5|0)!=(0);
 $7 = ($2|0)!=(0);
 $or$cond53 = $7 & $6;
 L1: do {
  if ($or$cond53) {
   $8 = $1&255;
   $$03555 = $0;$$03654 = $2;
   while(1) {
    $9 = HEAP8[$$03555>>0]|0;
    $10 = ($9<<24>>24)==($8<<24>>24);
    if ($10) {
     $$035$lcssa65 = $$03555;$$036$lcssa64 = $$03654;
     label = 6;
     break L1;
    }
    $11 = ((($$03555)) + 1|0);
    $12 = (($$03654) + -1)|0;
    $13 = $11;
    $14 = $13 & 3;
    $15 = ($14|0)!=(0);
    $16 = ($12|0)!=(0);
    $or$cond = $16 & $15;
    if ($or$cond) {
     $$03555 = $11;$$03654 = $12;
    } else {
     $$035$lcssa = $11;$$036$lcssa = $12;$$lcssa = $16;
     label = 5;
     break;
    }
   }
  } else {
   $$035$lcssa = $0;$$036$lcssa = $2;$$lcssa = $7;
   label = 5;
  }
 } while(0);
 if ((label|0) == 5) {
  if ($$lcssa) {
   $$035$lcssa65 = $$035$lcssa;$$036$lcssa64 = $$036$lcssa;
   label = 6;
  } else {
   label = 16;
  }
 }
 L8: do {
  if ((label|0) == 6) {
   $17 = HEAP8[$$035$lcssa65>>0]|0;
   $18 = $1&255;
   $19 = ($17<<24>>24)==($18<<24>>24);
   if ($19) {
    $38 = ($$036$lcssa64|0)==(0);
    if ($38) {
     label = 16;
     break;
    } else {
     $39 = $$035$lcssa65;
     break;
    }
   }
   $20 = Math_imul($3, 16843009)|0;
   $21 = ($$036$lcssa64>>>0)>(3);
   L13: do {
    if ($21) {
     $$046 = $$035$lcssa65;$$13745 = $$036$lcssa64;
     while(1) {
      $22 = HEAP32[$$046>>2]|0;
      $23 = $22 ^ $20;
      $24 = (($23) + -16843009)|0;
      $25 = $23 & -2139062144;
      $26 = $25 ^ -2139062144;
      $27 = $26 & $24;
      $28 = ($27|0)==(0);
      if (!($28)) {
       $$137$lcssa66 = $$13745;$$in = $$046;
       break L13;
      }
      $29 = ((($$046)) + 4|0);
      $30 = (($$13745) + -4)|0;
      $31 = ($30>>>0)>(3);
      if ($31) {
       $$046 = $29;$$13745 = $30;
      } else {
       $$0$lcssa = $29;$$137$lcssa = $30;
       label = 11;
       break;
      }
     }
    } else {
     $$0$lcssa = $$035$lcssa65;$$137$lcssa = $$036$lcssa64;
     label = 11;
    }
   } while(0);
   if ((label|0) == 11) {
    $32 = ($$137$lcssa|0)==(0);
    if ($32) {
     label = 16;
     break;
    } else {
     $$137$lcssa66 = $$137$lcssa;$$in = $$0$lcssa;
    }
   }
   $$140 = $$in;$$23839 = $$137$lcssa66;
   while(1) {
    $33 = HEAP8[$$140>>0]|0;
    $34 = ($33<<24>>24)==($18<<24>>24);
    if ($34) {
     $39 = $$140;
     break L8;
    }
    $35 = ((($$140)) + 1|0);
    $36 = (($$23839) + -1)|0;
    $37 = ($36|0)==(0);
    if ($37) {
     label = 16;
     break;
    } else {
     $$140 = $35;$$23839 = $36;
    }
   }
  }
 } while(0);
 if ((label|0) == 16) {
  $39 = 0;
 }
 return ($39|0);
}
function _pad_661($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$0$lcssa = 0, $$011 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 256|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(256|0);
 $5 = sp;
 $6 = $4 & 73728;
 $7 = ($6|0)==(0);
 $8 = ($2|0)>($3|0);
 $or$cond = $8 & $7;
 if ($or$cond) {
  $9 = (($2) - ($3))|0;
  $10 = $1 << 24 >> 24;
  $11 = ($9>>>0)<(256);
  $12 = $11 ? $9 : 256;
  (_memset(($5|0),($10|0),($12|0))|0);
  $13 = ($9>>>0)>(255);
  if ($13) {
   $14 = (($2) - ($3))|0;
   $$011 = $9;
   while(1) {
    _out($0,$5,256);
    $15 = (($$011) + -256)|0;
    $16 = ($15>>>0)>(255);
    if ($16) {
     $$011 = $15;
    } else {
     break;
    }
   }
   $17 = $14 & 255;
   $$0$lcssa = $17;
  } else {
   $$0$lcssa = $9;
  }
  _out($0,$5,$$0$lcssa);
 }
 STACKTOP = sp;return;
}
function _wctomb($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($0|0)==(0|0);
 if ($2) {
  $$0 = 0;
 } else {
  $3 = (_wcrtomb($0,$1,0)|0);
  $$0 = $3;
 }
 return ($$0|0);
}
function _fmt_fp($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = +$1;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $$ = 0, $$0 = 0, $$0463$lcssa = 0, $$0463588 = 0, $$0464599 = 0, $$0471 = 0.0, $$0479 = 0, $$0487657 = 0, $$0488 = 0, $$0488669 = 0, $$0488671 = 0, $$0497670 = 0, $$0498 = 0, $$0511586 = 0.0, $$0512 = 0, $$0513 = 0, $$0516652 = 0, $$0522 = 0, $$0523 = 0, $$0525 = 0;
 var $$0527 = 0, $$0529 = 0, $$0529$in646 = 0, $$0532651 = 0, $$1465 = 0, $$1467 = 0.0, $$1469 = 0.0, $$1472 = 0.0, $$1480 = 0, $$1482$lcssa = 0, $$1482683 = 0, $$1489656 = 0, $$1499 = 0, $$1510587 = 0, $$1514$lcssa = 0, $$1514614 = 0, $$1517 = 0, $$1526 = 0, $$1528 = 0, $$1530621 = 0;
 var $$1533$lcssa = 0, $$1533645 = 0, $$1604 = 0, $$2 = 0, $$2473 = 0.0, $$2476 = 0, $$2483 = 0, $$2490$lcssa = 0, $$2490638 = 0, $$2500$lcssa = 0, $$2500682 = 0, $$2515 = 0, $$2518634 = 0, $$2531 = 0, $$2534633 = 0, $$3 = 0.0, $$3477 = 0, $$3484$lcssa = 0, $$3484663 = 0, $$3501$lcssa = 0;
 var $$3501676 = 0, $$3535620 = 0, $$4 = 0.0, $$4478$lcssa = 0, $$4478594 = 0, $$4492 = 0, $$4502$lcssa = 0, $$4502662 = 0, $$4520 = 0, $$5$lcssa = 0, $$5486$lcssa = 0, $$5486639 = 0, $$5493603 = 0, $$5503 = 0, $$5521 = 0, $$560 = 0, $$5609 = 0, $$6 = 0, $$6494593 = 0, $$7495608 = 0;
 var $$8 = 0, $$8506 = 0, $$9 = 0, $$9507$lcssa = 0, $$9507625 = 0, $$lcssa583 = 0, $$lobit = 0, $$neg = 0, $$neg571 = 0, $$not = 0, $$pn = 0, $$pr = 0, $$pr564 = 0, $$pre = 0, $$pre$phi717Z2D = 0, $$pre$phi718Z2D = 0, $$pre720 = 0, $$sink757 = 0, $10 = 0, $100 = 0;
 var $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0;
 var $12 = 0, $120 = 0, $121 = 0.0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0.0, $129 = 0.0, $13 = 0, $130 = 0.0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0;
 var $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0.0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0;
 var $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0;
 var $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0;
 var $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0;
 var $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0;
 var $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0.0;
 var $247 = 0.0, $248 = 0, $249 = 0.0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0;
 var $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0;
 var $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $30 = 0, $300 = 0;
 var $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0;
 var $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0;
 var $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0;
 var $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0.0, $370 = 0, $371 = 0, $372 = 0, $373 = 0;
 var $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0.0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0;
 var $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0;
 var $410 = 0, $411 = 0, $412 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0.0, $54 = 0, $55 = 0, $56 = 0, $57 = 0.0, $58 = 0.0;
 var $59 = 0.0, $6 = 0, $60 = 0.0, $61 = 0.0, $62 = 0.0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0.0, $91 = 0.0, $92 = 0.0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $not$ = 0, $or$cond = 0, $or$cond3$not = 0, $or$cond543 = 0, $or$cond546 = 0, $or$cond556 = 0, $or$cond559 = 0, $or$cond6 = 0, $scevgep711 = 0, $scevgep711712 = 0, $spec$select = 0, $spec$select539 = 0, $spec$select540 = 0, $spec$select540722 = 0, $spec$select540723 = 0;
 var $spec$select541 = 0, $spec$select544 = 0.0, $spec$select547 = 0, $spec$select548 = 0, $spec$select549 = 0, $spec$select551 = 0, $spec$select554 = 0, $spec$select557 = 0, $spec$select561 = 0.0, $spec$select562 = 0, $spec$select563 = 0, $spec$select565 = 0, $spec$select566 = 0, $spec$select567 = 0.0, $spec$select568 = 0.0, $spec$select569 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 560|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(560|0);
 $6 = sp + 32|0;
 $7 = sp + 536|0;
 $8 = sp;
 $9 = $8;
 $10 = sp + 540|0;
 HEAP32[$7>>2] = 0;
 $11 = ((($10)) + 12|0);
 $12 = (___DOUBLE_BITS_662($1)|0);
 $13 = (getTempRet0() | 0);
 $14 = ($13|0)<(0);
 if ($14) {
  $15 = - $1;
  $16 = (___DOUBLE_BITS_662($15)|0);
  $17 = (getTempRet0() | 0);
  $$0471 = $15;$$0522 = 1;$$0523 = 5903;$25 = $17;$412 = $16;
 } else {
  $18 = $4 & 2048;
  $19 = ($18|0)==(0);
  $20 = $4 & 1;
  $21 = ($20|0)==(0);
  $$ = $21 ? (5904) : (5909);
  $spec$select565 = $19 ? $$ : (5906);
  $22 = $4 & 2049;
  $23 = ($22|0)!=(0);
  $spec$select566 = $23&1;
  $$0471 = $1;$$0522 = $spec$select566;$$0523 = $spec$select565;$25 = $13;$412 = $12;
 }
 $24 = $25 & 2146435072;
 $26 = (0)==(0);
 $27 = ($24|0)==(2146435072);
 $28 = $26 & $27;
 do {
  if ($28) {
   $29 = $5 & 32;
   $30 = ($29|0)!=(0);
   $31 = $30 ? 5922 : 5926;
   $32 = ($$0471 != $$0471) | (0.0 != 0.0);
   $33 = $30 ? 5930 : 5934;
   $$0512 = $32 ? $33 : $31;
   $34 = (($$0522) + 3)|0;
   $35 = $4 & -65537;
   _pad_661($0,32,$2,$34,$35);
   _out($0,$$0523,$$0522);
   _out($0,$$0512,3);
   $36 = $4 ^ 8192;
   _pad_661($0,32,$2,$34,$36);
   $$sink757 = $34;
  } else {
   $37 = (+_frexpl($$0471,$7));
   $38 = $37 * 2.0;
   $39 = $38 != 0.0;
   if ($39) {
    $40 = HEAP32[$7>>2]|0;
    $41 = (($40) + -1)|0;
    HEAP32[$7>>2] = $41;
   }
   $42 = $5 | 32;
   $43 = ($42|0)==(97);
   if ($43) {
    $44 = $5 & 32;
    $45 = ($44|0)==(0);
    $46 = ((($$0523)) + 9|0);
    $spec$select = $45 ? $$0523 : $46;
    $47 = $$0522 | 2;
    $48 = ($3>>>0)>(11);
    $49 = (12 - ($3))|0;
    $50 = ($49|0)==(0);
    $51 = $48 | $50;
    do {
     if ($51) {
      $$1472 = $38;
     } else {
      $$0511586 = 8.0;$$1510587 = $49;
      while(1) {
       $52 = (($$1510587) + -1)|0;
       $53 = $$0511586 * 16.0;
       $54 = ($52|0)==(0);
       if ($54) {
        break;
       } else {
        $$0511586 = $53;$$1510587 = $52;
       }
      }
      $55 = HEAP8[$spec$select>>0]|0;
      $56 = ($55<<24>>24)==(45);
      if ($56) {
       $57 = - $38;
       $58 = $57 - $53;
       $59 = $53 + $58;
       $60 = - $59;
       $$1472 = $60;
       break;
      } else {
       $61 = $38 + $53;
       $62 = $61 - $53;
       $$1472 = $62;
       break;
      }
     }
    } while(0);
    $63 = HEAP32[$7>>2]|0;
    $64 = ($63|0)<(0);
    $65 = (0 - ($63))|0;
    $66 = $64 ? $65 : $63;
    $67 = ($66|0)<(0);
    $68 = $67 << 31 >> 31;
    $69 = (_fmt_u($66,$68,$11)|0);
    $70 = ($69|0)==($11|0);
    if ($70) {
     $71 = ((($10)) + 11|0);
     HEAP8[$71>>0] = 48;
     $$0513 = $71;
    } else {
     $$0513 = $69;
    }
    $72 = $63 >> 31;
    $73 = $72 & 2;
    $74 = (($73) + 43)|0;
    $75 = $74&255;
    $76 = ((($$0513)) + -1|0);
    HEAP8[$76>>0] = $75;
    $77 = (($5) + 15)|0;
    $78 = $77&255;
    $79 = ((($$0513)) + -2|0);
    HEAP8[$79>>0] = $78;
    $80 = ($3|0)<(1);
    $81 = $4 & 8;
    $82 = ($81|0)==(0);
    $$0525 = $8;$$2473 = $$1472;
    while(1) {
     $83 = (~~(($$2473)));
     $84 = (512 + ($83)|0);
     $85 = HEAP8[$84>>0]|0;
     $86 = $85&255;
     $87 = $44 | $86;
     $88 = $87&255;
     $89 = ((($$0525)) + 1|0);
     HEAP8[$$0525>>0] = $88;
     $90 = (+($83|0));
     $91 = $$2473 - $90;
     $92 = $91 * 16.0;
     $93 = $89;
     $94 = (($93) - ($9))|0;
     $95 = ($94|0)==(1);
     if ($95) {
      $96 = $92 == 0.0;
      $or$cond3$not = $80 & $96;
      $or$cond = $82 & $or$cond3$not;
      if ($or$cond) {
       $$1526 = $89;
      } else {
       $97 = ((($$0525)) + 2|0);
       HEAP8[$89>>0] = 46;
       $$1526 = $97;
      }
     } else {
      $$1526 = $89;
     }
     $98 = $92 != 0.0;
     if ($98) {
      $$0525 = $$1526;$$2473 = $92;
     } else {
      break;
     }
    }
    $99 = ($3|0)==(0);
    $$pre720 = $$1526;
    if ($99) {
     label = 25;
    } else {
     $100 = (-2 - ($9))|0;
     $101 = (($100) + ($$pre720))|0;
     $102 = ($101|0)<($3|0);
     if ($102) {
      $103 = $11;
      $104 = $79;
      $105 = (($3) + 2)|0;
      $106 = (($105) + ($103))|0;
      $107 = (($106) - ($104))|0;
      $$0527 = $107;$$pre$phi717Z2D = $103;$$pre$phi718Z2D = $104;
     } else {
      label = 25;
     }
    }
    if ((label|0) == 25) {
     $108 = $11;
     $109 = $79;
     $110 = (($108) - ($9))|0;
     $111 = (($110) - ($109))|0;
     $112 = (($111) + ($$pre720))|0;
     $$0527 = $112;$$pre$phi717Z2D = $108;$$pre$phi718Z2D = $109;
    }
    $113 = (($$0527) + ($47))|0;
    _pad_661($0,32,$2,$113,$4);
    _out($0,$spec$select,$47);
    $114 = $4 ^ 65536;
    _pad_661($0,48,$2,$113,$114);
    $115 = (($$pre720) - ($9))|0;
    _out($0,$8,$115);
    $116 = (($$pre$phi717Z2D) - ($$pre$phi718Z2D))|0;
    $117 = (($115) + ($116))|0;
    $118 = (($$0527) - ($117))|0;
    _pad_661($0,48,$118,0,0);
    _out($0,$79,$116);
    $119 = $4 ^ 8192;
    _pad_661($0,32,$2,$113,$119);
    $$sink757 = $113;
    break;
   }
   $120 = ($3|0)<(0);
   $spec$select539 = $120 ? 6 : $3;
   if ($39) {
    $121 = $38 * 268435456.0;
    $122 = HEAP32[$7>>2]|0;
    $123 = (($122) + -28)|0;
    HEAP32[$7>>2] = $123;
    $$3 = $121;$$pr = $123;
   } else {
    $$pre = HEAP32[$7>>2]|0;
    $$3 = $38;$$pr = $$pre;
   }
   $124 = ($$pr|0)<(0);
   $125 = ((($6)) + 288|0);
   $$0498 = $124 ? $6 : $125;
   $$1499 = $$0498;$$4 = $$3;
   while(1) {
    $126 = (~~(($$4))>>>0);
    HEAP32[$$1499>>2] = $126;
    $127 = ((($$1499)) + 4|0);
    $128 = (+($126>>>0));
    $129 = $$4 - $128;
    $130 = $129 * 1.0E+9;
    $131 = $130 != 0.0;
    if ($131) {
     $$1499 = $127;$$4 = $130;
    } else {
     break;
    }
   }
   $132 = $$0498;
   $133 = ($$pr|0)>(0);
   if ($133) {
    $$1482683 = $$0498;$$2500682 = $127;$134 = $$pr;
    while(1) {
     $135 = ($134|0)<(29);
     $136 = $135 ? $134 : 29;
     $$0488669 = ((($$2500682)) + -4|0);
     $137 = ($$0488669>>>0)<($$1482683>>>0);
     if ($137) {
      $$2483 = $$1482683;
     } else {
      $$0488671 = $$0488669;$$0497670 = 0;
      while(1) {
       $138 = HEAP32[$$0488671>>2]|0;
       $139 = (_bitshift64Shl(($138|0),0,($136|0))|0);
       $140 = (getTempRet0() | 0);
       $141 = (_i64Add(($139|0),($140|0),($$0497670|0),0)|0);
       $142 = (getTempRet0() | 0);
       $143 = (___udivdi3(($141|0),($142|0),1000000000,0)|0);
       $144 = (getTempRet0() | 0);
       $145 = (___muldi3(($143|0),($144|0),1000000000,0)|0);
       $146 = (getTempRet0() | 0);
       $147 = (_i64Subtract(($141|0),($142|0),($145|0),($146|0))|0);
       $148 = (getTempRet0() | 0);
       HEAP32[$$0488671>>2] = $147;
       $$0488 = ((($$0488671)) + -4|0);
       $149 = ($$0488>>>0)<($$1482683>>>0);
       if ($149) {
        break;
       } else {
        $$0488671 = $$0488;$$0497670 = $143;
       }
      }
      $150 = ($143|0)==(0);
      if ($150) {
       $$2483 = $$1482683;
      } else {
       $151 = ((($$1482683)) + -4|0);
       HEAP32[$151>>2] = $143;
       $$2483 = $151;
      }
     }
     $152 = ($$2500682>>>0)>($$2483>>>0);
     L57: do {
      if ($152) {
       $$3501676 = $$2500682;
       while(1) {
        $153 = ((($$3501676)) + -4|0);
        $155 = HEAP32[$153>>2]|0;
        $156 = ($155|0)==(0);
        if (!($156)) {
         $$3501$lcssa = $$3501676;
         break L57;
        }
        $154 = ($153>>>0)>($$2483>>>0);
        if ($154) {
         $$3501676 = $153;
        } else {
         $$3501$lcssa = $153;
         break;
        }
       }
      } else {
       $$3501$lcssa = $$2500682;
      }
     } while(0);
     $157 = HEAP32[$7>>2]|0;
     $158 = (($157) - ($136))|0;
     HEAP32[$7>>2] = $158;
     $159 = ($158|0)>(0);
     if ($159) {
      $$1482683 = $$2483;$$2500682 = $$3501$lcssa;$134 = $158;
     } else {
      $$1482$lcssa = $$2483;$$2500$lcssa = $$3501$lcssa;$$pr564 = $158;
      break;
     }
    }
   } else {
    $$1482$lcssa = $$0498;$$2500$lcssa = $127;$$pr564 = $$pr;
   }
   $160 = ($$pr564|0)<(0);
   if ($160) {
    $161 = (($spec$select539) + 25)|0;
    $162 = (($161|0) / 9)&-1;
    $163 = (($162) + 1)|0;
    $164 = ($42|0)==(102);
    $$3484663 = $$1482$lcssa;$$4502662 = $$2500$lcssa;$166 = $$pr564;
    while(1) {
     $165 = (0 - ($166))|0;
     $167 = ($165|0)<(9);
     $168 = $167 ? $165 : 9;
     $169 = ($$3484663>>>0)<($$4502662>>>0);
     if ($169) {
      $173 = 1 << $168;
      $174 = (($173) + -1)|0;
      $175 = 1000000000 >>> $168;
      $$0487657 = 0;$$1489656 = $$3484663;
      while(1) {
       $176 = HEAP32[$$1489656>>2]|0;
       $177 = $176 & $174;
       $178 = $176 >>> $168;
       $179 = (($178) + ($$0487657))|0;
       HEAP32[$$1489656>>2] = $179;
       $180 = Math_imul($177, $175)|0;
       $181 = ((($$1489656)) + 4|0);
       $182 = ($181>>>0)<($$4502662>>>0);
       if ($182) {
        $$0487657 = $180;$$1489656 = $181;
       } else {
        break;
       }
      }
      $183 = HEAP32[$$3484663>>2]|0;
      $184 = ($183|0)==(0);
      $185 = ((($$3484663)) + 4|0);
      $spec$select540 = $184 ? $185 : $$3484663;
      $186 = ($180|0)==(0);
      if ($186) {
       $$5503 = $$4502662;$spec$select540723 = $spec$select540;
      } else {
       $187 = ((($$4502662)) + 4|0);
       HEAP32[$$4502662>>2] = $180;
       $$5503 = $187;$spec$select540723 = $spec$select540;
      }
     } else {
      $170 = HEAP32[$$3484663>>2]|0;
      $171 = ($170|0)==(0);
      $172 = ((($$3484663)) + 4|0);
      $spec$select540722 = $171 ? $172 : $$3484663;
      $$5503 = $$4502662;$spec$select540723 = $spec$select540722;
     }
     $188 = $164 ? $$0498 : $spec$select540723;
     $189 = $$5503;
     $190 = $188;
     $191 = (($189) - ($190))|0;
     $192 = $191 >> 2;
     $193 = ($192|0)>($163|0);
     $194 = (($188) + ($163<<2)|0);
     $spec$select541 = $193 ? $194 : $$5503;
     $195 = HEAP32[$7>>2]|0;
     $196 = (($195) + ($168))|0;
     HEAP32[$7>>2] = $196;
     $197 = ($196|0)<(0);
     if ($197) {
      $$3484663 = $spec$select540723;$$4502662 = $spec$select541;$166 = $196;
     } else {
      $$3484$lcssa = $spec$select540723;$$4502$lcssa = $spec$select541;
      break;
     }
    }
   } else {
    $$3484$lcssa = $$1482$lcssa;$$4502$lcssa = $$2500$lcssa;
   }
   $198 = ($$3484$lcssa>>>0)<($$4502$lcssa>>>0);
   if ($198) {
    $199 = $$3484$lcssa;
    $200 = (($132) - ($199))|0;
    $201 = $200 >> 2;
    $202 = ($201*9)|0;
    $203 = HEAP32[$$3484$lcssa>>2]|0;
    $204 = ($203>>>0)<(10);
    if ($204) {
     $$1517 = $202;
    } else {
     $$0516652 = $202;$$0532651 = 10;
     while(1) {
      $205 = ($$0532651*10)|0;
      $206 = (($$0516652) + 1)|0;
      $207 = ($203>>>0)<($205>>>0);
      if ($207) {
       $$1517 = $206;
       break;
      } else {
       $$0516652 = $206;$$0532651 = $205;
      }
     }
    }
   } else {
    $$1517 = 0;
   }
   $208 = ($42|0)==(102);
   $209 = $208 ? 0 : $$1517;
   $210 = (($spec$select539) - ($209))|0;
   $211 = ($42|0)==(103);
   $212 = ($spec$select539|0)!=(0);
   $213 = $212 & $211;
   $$neg = $213 << 31 >> 31;
   $214 = (($210) + ($$neg))|0;
   $215 = $$4502$lcssa;
   $216 = (($215) - ($132))|0;
   $217 = $216 >> 2;
   $218 = ($217*9)|0;
   $219 = (($218) + -9)|0;
   $220 = ($214|0)<($219|0);
   if ($220) {
    $221 = ((($$0498)) + 4|0);
    $222 = (($214) + 9216)|0;
    $223 = (($222|0) / 9)&-1;
    $224 = (($223) + -1024)|0;
    $225 = (($221) + ($224<<2)|0);
    $226 = ($223*9)|0;
    $227 = (($222) - ($226))|0;
    $228 = ($227|0)<(8);
    if ($228) {
     $$0529$in646 = $227;$$1533645 = 10;
     while(1) {
      $$0529 = (($$0529$in646) + 1)|0;
      $229 = ($$1533645*10)|0;
      $230 = ($$0529$in646|0)<(7);
      if ($230) {
       $$0529$in646 = $$0529;$$1533645 = $229;
      } else {
       $$1533$lcssa = $229;
       break;
      }
     }
    } else {
     $$1533$lcssa = 10;
    }
    $231 = HEAP32[$225>>2]|0;
    $232 = (($231>>>0) / ($$1533$lcssa>>>0))&-1;
    $233 = Math_imul($232, $$1533$lcssa)|0;
    $234 = (($231) - ($233))|0;
    $235 = ($234|0)==(0);
    $236 = ((($225)) + 4|0);
    $237 = ($236|0)==($$4502$lcssa|0);
    $or$cond543 = $237 & $235;
    if ($or$cond543) {
     $$4492 = $225;$$4520 = $$1517;$$8 = $$3484$lcssa;
    } else {
     $238 = $232 & 1;
     $239 = ($238|0)==(0);
     $spec$select544 = $239 ? 9007199254740992.0 : 9007199254740994.0;
     $240 = $$1533$lcssa >>> 1;
     $241 = ($234>>>0)<($240>>>0);
     $242 = ($234|0)==($240|0);
     $or$cond546 = $237 & $242;
     $spec$select561 = $or$cond546 ? 1.0 : 1.5;
     $spec$select567 = $241 ? 0.5 : $spec$select561;
     $243 = ($$0522|0)==(0);
     if ($243) {
      $$1467 = $spec$select567;$$1469 = $spec$select544;
     } else {
      $244 = HEAP8[$$0523>>0]|0;
      $245 = ($244<<24>>24)==(45);
      $246 = - $spec$select544;
      $247 = - $spec$select567;
      $spec$select568 = $245 ? $246 : $spec$select544;
      $spec$select569 = $245 ? $247 : $spec$select567;
      $$1467 = $spec$select569;$$1469 = $spec$select568;
     }
     $248 = (($231) - ($234))|0;
     HEAP32[$225>>2] = $248;
     $249 = $$1469 + $$1467;
     $250 = $249 != $$1469;
     if ($250) {
      $251 = (($248) + ($$1533$lcssa))|0;
      HEAP32[$225>>2] = $251;
      $252 = ($251>>>0)>(999999999);
      if ($252) {
       $$2490638 = $225;$$5486639 = $$3484$lcssa;
       while(1) {
        $253 = ((($$2490638)) + -4|0);
        HEAP32[$$2490638>>2] = 0;
        $254 = ($253>>>0)<($$5486639>>>0);
        if ($254) {
         $255 = ((($$5486639)) + -4|0);
         HEAP32[$255>>2] = 0;
         $$6 = $255;
        } else {
         $$6 = $$5486639;
        }
        $256 = HEAP32[$253>>2]|0;
        $257 = (($256) + 1)|0;
        HEAP32[$253>>2] = $257;
        $258 = ($257>>>0)>(999999999);
        if ($258) {
         $$2490638 = $253;$$5486639 = $$6;
        } else {
         $$2490$lcssa = $253;$$5486$lcssa = $$6;
         break;
        }
       }
      } else {
       $$2490$lcssa = $225;$$5486$lcssa = $$3484$lcssa;
      }
      $259 = $$5486$lcssa;
      $260 = (($132) - ($259))|0;
      $261 = $260 >> 2;
      $262 = ($261*9)|0;
      $263 = HEAP32[$$5486$lcssa>>2]|0;
      $264 = ($263>>>0)<(10);
      if ($264) {
       $$4492 = $$2490$lcssa;$$4520 = $262;$$8 = $$5486$lcssa;
      } else {
       $$2518634 = $262;$$2534633 = 10;
       while(1) {
        $265 = ($$2534633*10)|0;
        $266 = (($$2518634) + 1)|0;
        $267 = ($263>>>0)<($265>>>0);
        if ($267) {
         $$4492 = $$2490$lcssa;$$4520 = $266;$$8 = $$5486$lcssa;
         break;
        } else {
         $$2518634 = $266;$$2534633 = $265;
        }
       }
      }
     } else {
      $$4492 = $225;$$4520 = $$1517;$$8 = $$3484$lcssa;
     }
    }
    $268 = ((($$4492)) + 4|0);
    $269 = ($$4502$lcssa>>>0)>($268>>>0);
    $spec$select547 = $269 ? $268 : $$4502$lcssa;
    $$5521 = $$4520;$$8506 = $spec$select547;$$9 = $$8;
   } else {
    $$5521 = $$1517;$$8506 = $$4502$lcssa;$$9 = $$3484$lcssa;
   }
   $270 = (0 - ($$5521))|0;
   $271 = ($$8506>>>0)>($$9>>>0);
   L109: do {
    if ($271) {
     $$9507625 = $$8506;
     while(1) {
      $272 = ((($$9507625)) + -4|0);
      $274 = HEAP32[$272>>2]|0;
      $275 = ($274|0)==(0);
      if (!($275)) {
       $$9507$lcssa = $$9507625;$$lcssa583 = 1;
       break L109;
      }
      $273 = ($272>>>0)>($$9>>>0);
      if ($273) {
       $$9507625 = $272;
      } else {
       $$9507$lcssa = $272;$$lcssa583 = 0;
       break;
      }
     }
    } else {
     $$9507$lcssa = $$8506;$$lcssa583 = 0;
    }
   } while(0);
   do {
    if ($211) {
     $not$ = $212 ^ 1;
     $276 = $not$&1;
     $spec$select548 = (($spec$select539) + ($276))|0;
     $277 = ($spec$select548|0)>($$5521|0);
     $278 = ($$5521|0)>(-5);
     $or$cond6 = $277 & $278;
     if ($or$cond6) {
      $279 = (($5) + -1)|0;
      $$neg571 = (($spec$select548) + -1)|0;
      $280 = (($$neg571) - ($$5521))|0;
      $$0479 = $279;$$2476 = $280;
     } else {
      $281 = (($5) + -2)|0;
      $282 = (($spec$select548) + -1)|0;
      $$0479 = $281;$$2476 = $282;
     }
     $283 = $4 & 8;
     $284 = ($283|0)==(0);
     if ($284) {
      if ($$lcssa583) {
       $285 = ((($$9507$lcssa)) + -4|0);
       $286 = HEAP32[$285>>2]|0;
       $287 = ($286|0)==(0);
       if ($287) {
        $$2531 = 9;
       } else {
        $288 = (($286>>>0) % 10)&-1;
        $289 = ($288|0)==(0);
        if ($289) {
         $$1530621 = 0;$$3535620 = 10;
         while(1) {
          $290 = ($$3535620*10)|0;
          $291 = (($$1530621) + 1)|0;
          $292 = (($286>>>0) % ($290>>>0))&-1;
          $293 = ($292|0)==(0);
          if ($293) {
           $$1530621 = $291;$$3535620 = $290;
          } else {
           $$2531 = $291;
           break;
          }
         }
        } else {
         $$2531 = 0;
        }
       }
      } else {
       $$2531 = 9;
      }
      $294 = $$0479 | 32;
      $295 = ($294|0)==(102);
      $296 = $$9507$lcssa;
      $297 = (($296) - ($132))|0;
      $298 = $297 >> 2;
      $299 = ($298*9)|0;
      $300 = (($299) + -9)|0;
      if ($295) {
       $301 = (($300) - ($$2531))|0;
       $302 = ($301|0)>(0);
       $spec$select549 = $302 ? $301 : 0;
       $303 = ($$2476|0)<($spec$select549|0);
       $spec$select562 = $303 ? $$2476 : $spec$select549;
       $$1480 = $$0479;$$3477 = $spec$select562;
       break;
      } else {
       $304 = (($300) + ($$5521))|0;
       $305 = (($304) - ($$2531))|0;
       $306 = ($305|0)>(0);
       $spec$select551 = $306 ? $305 : 0;
       $307 = ($$2476|0)<($spec$select551|0);
       $spec$select563 = $307 ? $$2476 : $spec$select551;
       $$1480 = $$0479;$$3477 = $spec$select563;
       break;
      }
     } else {
      $$1480 = $$0479;$$3477 = $$2476;
     }
    } else {
     $$1480 = $5;$$3477 = $spec$select539;
    }
   } while(0);
   $308 = ($$3477|0)!=(0);
   $309 = $4 >>> 3;
   $$lobit = $309 & 1;
   $310 = $308 ? 1 : $$lobit;
   $311 = $$1480 | 32;
   $312 = ($311|0)==(102);
   if ($312) {
    $313 = ($$5521|0)>(0);
    $314 = $313 ? $$5521 : 0;
    $$2515 = 0;$$pn = $314;
   } else {
    $315 = ($$5521|0)<(0);
    $316 = $315 ? $270 : $$5521;
    $317 = ($316|0)<(0);
    $318 = $317 << 31 >> 31;
    $319 = (_fmt_u($316,$318,$11)|0);
    $320 = $11;
    $321 = $319;
    $322 = (($320) - ($321))|0;
    $323 = ($322|0)<(2);
    if ($323) {
     $$1514614 = $319;
     while(1) {
      $324 = ((($$1514614)) + -1|0);
      HEAP8[$324>>0] = 48;
      $325 = $324;
      $326 = (($320) - ($325))|0;
      $327 = ($326|0)<(2);
      if ($327) {
       $$1514614 = $324;
      } else {
       $$1514$lcssa = $324;
       break;
      }
     }
    } else {
     $$1514$lcssa = $319;
    }
    $328 = $$5521 >> 31;
    $329 = $328 & 2;
    $330 = (($329) + 43)|0;
    $331 = $330&255;
    $332 = ((($$1514$lcssa)) + -1|0);
    HEAP8[$332>>0] = $331;
    $333 = $$1480&255;
    $334 = ((($$1514$lcssa)) + -2|0);
    HEAP8[$334>>0] = $333;
    $335 = $334;
    $336 = (($320) - ($335))|0;
    $$2515 = $334;$$pn = $336;
   }
   $337 = (($$0522) + 1)|0;
   $338 = (($337) + ($$3477))|0;
   $$1528 = (($338) + ($310))|0;
   $339 = (($$1528) + ($$pn))|0;
   _pad_661($0,32,$2,$339,$4);
   _out($0,$$0523,$$0522);
   $340 = $4 ^ 65536;
   _pad_661($0,48,$2,$339,$340);
   if ($312) {
    $341 = ($$9>>>0)>($$0498>>>0);
    $spec$select554 = $341 ? $$0498 : $$9;
    $342 = ((($8)) + 9|0);
    $343 = $342;
    $344 = ((($8)) + 8|0);
    $$5493603 = $spec$select554;
    while(1) {
     $345 = HEAP32[$$5493603>>2]|0;
     $346 = (_fmt_u($345,0,$342)|0);
     $347 = ($$5493603|0)==($spec$select554|0);
     if ($347) {
      $353 = ($346|0)==($342|0);
      if ($353) {
       HEAP8[$344>>0] = 48;
       $$1465 = $344;
      } else {
       $$1465 = $346;
      }
     } else {
      $348 = ($346>>>0)>($8>>>0);
      if ($348) {
       $349 = $346;
       $350 = (($349) - ($9))|0;
       _memset(($8|0),48,($350|0))|0;
       $$0464599 = $346;
       while(1) {
        $351 = ((($$0464599)) + -1|0);
        $352 = ($351>>>0)>($8>>>0);
        if ($352) {
         $$0464599 = $351;
        } else {
         $$1465 = $351;
         break;
        }
       }
      } else {
       $$1465 = $346;
      }
     }
     $354 = $$1465;
     $355 = (($343) - ($354))|0;
     _out($0,$$1465,$355);
     $356 = ((($$5493603)) + 4|0);
     $357 = ($356>>>0)>($$0498>>>0);
     if ($357) {
      break;
     } else {
      $$5493603 = $356;
     }
    }
    $$not = $308 ^ 1;
    $358 = $4 & 8;
    $359 = ($358|0)==(0);
    $or$cond556 = $359 & $$not;
    if (!($or$cond556)) {
     _out($0,5938,1);
    }
    $360 = ($356>>>0)<($$9507$lcssa>>>0);
    $361 = ($$3477|0)>(0);
    $362 = $360 & $361;
    if ($362) {
     $$4478594 = $$3477;$$6494593 = $356;
     while(1) {
      $363 = HEAP32[$$6494593>>2]|0;
      $364 = (_fmt_u($363,0,$342)|0);
      $365 = ($364>>>0)>($8>>>0);
      if ($365) {
       $366 = $364;
       $367 = (($366) - ($9))|0;
       _memset(($8|0),48,($367|0))|0;
       $$0463588 = $364;
       while(1) {
        $368 = ((($$0463588)) + -1|0);
        $369 = ($368>>>0)>($8>>>0);
        if ($369) {
         $$0463588 = $368;
        } else {
         $$0463$lcssa = $368;
         break;
        }
       }
      } else {
       $$0463$lcssa = $364;
      }
      $370 = ($$4478594|0)<(9);
      $371 = $370 ? $$4478594 : 9;
      _out($0,$$0463$lcssa,$371);
      $372 = ((($$6494593)) + 4|0);
      $373 = (($$4478594) + -9)|0;
      $374 = ($372>>>0)<($$9507$lcssa>>>0);
      $375 = ($$4478594|0)>(9);
      $376 = $374 & $375;
      if ($376) {
       $$4478594 = $373;$$6494593 = $372;
      } else {
       $$4478$lcssa = $373;
       break;
      }
     }
    } else {
     $$4478$lcssa = $$3477;
    }
    $377 = (($$4478$lcssa) + 9)|0;
    _pad_661($0,48,$377,9,0);
   } else {
    $378 = ((($$9)) + 4|0);
    $spec$select557 = $$lcssa583 ? $$9507$lcssa : $378;
    $379 = ($$9>>>0)<($spec$select557>>>0);
    $380 = ($$3477|0)>(-1);
    $381 = $379 & $380;
    if ($381) {
     $382 = ((($8)) + 9|0);
     $383 = $4 & 8;
     $384 = ($383|0)==(0);
     $385 = $382;
     $386 = (0 - ($9))|0;
     $387 = ((($8)) + 8|0);
     $$5609 = $$3477;$$7495608 = $$9;
     while(1) {
      $388 = HEAP32[$$7495608>>2]|0;
      $389 = (_fmt_u($388,0,$382)|0);
      $390 = ($389|0)==($382|0);
      if ($390) {
       HEAP8[$387>>0] = 48;
       $$0 = $387;
      } else {
       $$0 = $389;
      }
      $391 = ($$7495608|0)==($$9|0);
      do {
       if ($391) {
        $395 = ((($$0)) + 1|0);
        _out($0,$$0,1);
        $396 = ($$5609|0)<(1);
        $or$cond559 = $384 & $396;
        if ($or$cond559) {
         $$2 = $395;
         break;
        }
        _out($0,5938,1);
        $$2 = $395;
       } else {
        $392 = ($$0>>>0)>($8>>>0);
        if (!($392)) {
         $$2 = $$0;
         break;
        }
        $scevgep711 = (($$0) + ($386)|0);
        $scevgep711712 = $scevgep711;
        _memset(($8|0),48,($scevgep711712|0))|0;
        $$1604 = $$0;
        while(1) {
         $393 = ((($$1604)) + -1|0);
         $394 = ($393>>>0)>($8>>>0);
         if ($394) {
          $$1604 = $393;
         } else {
          $$2 = $393;
          break;
         }
        }
       }
      } while(0);
      $397 = $$2;
      $398 = (($385) - ($397))|0;
      $399 = ($$5609|0)>($398|0);
      $400 = $399 ? $398 : $$5609;
      _out($0,$$2,$400);
      $401 = (($$5609) - ($398))|0;
      $402 = ((($$7495608)) + 4|0);
      $403 = ($402>>>0)<($spec$select557>>>0);
      $404 = ($401|0)>(-1);
      $405 = $403 & $404;
      if ($405) {
       $$5609 = $401;$$7495608 = $402;
      } else {
       $$5$lcssa = $401;
       break;
      }
     }
    } else {
     $$5$lcssa = $$3477;
    }
    $406 = (($$5$lcssa) + 18)|0;
    _pad_661($0,48,$406,18,0);
    $407 = $11;
    $408 = $$2515;
    $409 = (($407) - ($408))|0;
    _out($0,$$2515,$409);
   }
   $410 = $4 ^ 8192;
   _pad_661($0,32,$2,$339,$410);
   $$sink757 = $339;
  }
 } while(0);
 $411 = ($$sink757|0)<($2|0);
 $$560 = $411 ? $2 : $$sink757;
 STACKTOP = sp;return ($$560|0);
}
function ___DOUBLE_BITS_662($0) {
 $0 = +$0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF64[tempDoublePtr>>3] = $0;$1 = HEAP32[tempDoublePtr>>2]|0;
 $2 = HEAP32[tempDoublePtr+4>>2]|0;
 setTempRet0(($2) | 0);
 return ($1|0);
}
function _frexpl($0,$1) {
 $0 = +$0;
 $1 = $1|0;
 var $2 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (+_frexp($0,$1));
 return (+$2);
}
function _frexp($0,$1) {
 $0 = +$0;
 $1 = $1|0;
 var $$0 = 0.0, $$016 = 0.0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0.0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0.0, $storemerge = 0, $trunc$clear = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 HEAPF64[tempDoublePtr>>3] = $0;$2 = HEAP32[tempDoublePtr>>2]|0;
 $3 = HEAP32[tempDoublePtr+4>>2]|0;
 $4 = (_bitshift64Lshr(($2|0),($3|0),52)|0);
 $5 = (getTempRet0() | 0);
 $6 = $4&65535;
 $trunc$clear = $6 & 2047;
 switch ($trunc$clear<<16>>16) {
 case 0:  {
  $7 = $0 != 0.0;
  if ($7) {
   $8 = $0 * 1.8446744073709552E+19;
   $9 = (+_frexp($8,$1));
   $10 = HEAP32[$1>>2]|0;
   $11 = (($10) + -64)|0;
   $$016 = $9;$storemerge = $11;
  } else {
   $$016 = $0;$storemerge = 0;
  }
  HEAP32[$1>>2] = $storemerge;
  $$0 = $$016;
  break;
 }
 case 2047:  {
  $$0 = $0;
  break;
 }
 default: {
  $12 = $4 & 2047;
  $13 = (($12) + -1022)|0;
  HEAP32[$1>>2] = $13;
  $14 = $3 & -2146435073;
  $15 = $14 | 1071644672;
  HEAP32[tempDoublePtr>>2] = $2;HEAP32[tempDoublePtr+4>>2] = $15;$16 = +HEAPF64[tempDoublePtr>>3];
  $$0 = $16;
 }
 }
 return (+$$0);
}
function _wcrtomb($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($0|0)==(0|0);
 do {
  if ($3) {
   $$0 = 1;
  } else {
   $4 = ($1>>>0)<(128);
   if ($4) {
    $5 = $1&255;
    HEAP8[$0>>0] = $5;
    $$0 = 1;
    break;
   }
   $6 = (___pthread_self_440()|0);
   $7 = ((($6)) + 188|0);
   $8 = HEAP32[$7>>2]|0;
   $9 = HEAP32[$8>>2]|0;
   $10 = ($9|0)==(0|0);
   if ($10) {
    $11 = $1 & -128;
    $12 = ($11|0)==(57216);
    if ($12) {
     $14 = $1&255;
     HEAP8[$0>>0] = $14;
     $$0 = 1;
     break;
    } else {
     $13 = (___errno_location()|0);
     HEAP32[$13>>2] = 84;
     $$0 = -1;
     break;
    }
   }
   $15 = ($1>>>0)<(2048);
   if ($15) {
    $16 = $1 >>> 6;
    $17 = $16 | 192;
    $18 = $17&255;
    $19 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $18;
    $20 = $1 & 63;
    $21 = $20 | 128;
    $22 = $21&255;
    HEAP8[$19>>0] = $22;
    $$0 = 2;
    break;
   }
   $23 = ($1>>>0)<(55296);
   $24 = $1 & -8192;
   $25 = ($24|0)==(57344);
   $or$cond = $23 | $25;
   if ($or$cond) {
    $26 = $1 >>> 12;
    $27 = $26 | 224;
    $28 = $27&255;
    $29 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $28;
    $30 = $1 >>> 6;
    $31 = $30 & 63;
    $32 = $31 | 128;
    $33 = $32&255;
    $34 = ((($0)) + 2|0);
    HEAP8[$29>>0] = $33;
    $35 = $1 & 63;
    $36 = $35 | 128;
    $37 = $36&255;
    HEAP8[$34>>0] = $37;
    $$0 = 3;
    break;
   }
   $38 = (($1) + -65536)|0;
   $39 = ($38>>>0)<(1048576);
   if ($39) {
    $40 = $1 >>> 18;
    $41 = $40 | 240;
    $42 = $41&255;
    $43 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $42;
    $44 = $1 >>> 12;
    $45 = $44 & 63;
    $46 = $45 | 128;
    $47 = $46&255;
    $48 = ((($0)) + 2|0);
    HEAP8[$43>>0] = $47;
    $49 = $1 >>> 6;
    $50 = $49 & 63;
    $51 = $50 | 128;
    $52 = $51&255;
    $53 = ((($0)) + 3|0);
    HEAP8[$48>>0] = $52;
    $54 = $1 & 63;
    $55 = $54 | 128;
    $56 = $55&255;
    HEAP8[$53>>0] = $56;
    $$0 = 4;
    break;
   } else {
    $57 = (___errno_location()|0);
    HEAP32[$57>>2] = 84;
    $$0 = -1;
    break;
   }
  }
 } while(0);
 return ($$0|0);
}
function ___pthread_self_440() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (_pthread_self()|0);
 return ($0|0);
}
function _pthread_self() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (3288|0);
}
function ___pthread_self_107() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (_pthread_self()|0);
 return ($0|0);
}
function ___strerror_l($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$012$lcssa = 0, $$01214 = 0, $$016 = 0, $$113 = 0, $$115 = 0, $$115$ph = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $$016 = 0;
 while(1) {
  $2 = (528 + ($$016)|0);
  $3 = HEAP8[$2>>0]|0;
  $4 = $3&255;
  $5 = ($4|0)==($0|0);
  if ($5) {
   label = 4;
   break;
  }
  $6 = (($$016) + 1)|0;
  $7 = ($6|0)==(87);
  if ($7) {
   $$115$ph = 87;
   label = 5;
   break;
  } else {
   $$016 = $6;
  }
 }
 if ((label|0) == 4) {
  $8 = ($$016|0)==(0);
  if ($8) {
   $$012$lcssa = 624;
  } else {
   $$115$ph = $$016;
   label = 5;
  }
 }
 if ((label|0) == 5) {
  $$01214 = 624;$$115 = $$115$ph;
  while(1) {
   $$113 = $$01214;
   while(1) {
    $9 = HEAP8[$$113>>0]|0;
    $10 = ($9<<24>>24)==(0);
    $11 = ((($$113)) + 1|0);
    if ($10) {
     break;
    } else {
     $$113 = $11;
    }
   }
   $12 = (($$115) + -1)|0;
   $13 = ($12|0)==(0);
   if ($13) {
    $$012$lcssa = $11;
    break;
   } else {
    $$01214 = $11;$$115 = $12;
   }
  }
 }
 $14 = ((($1)) + 20|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (___lctrans($$012$lcssa,$15)|0);
 return ($16|0);
}
function ___lctrans($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (___lctrans_impl($0,$1)|0);
 return ($2|0);
}
function ___lctrans_impl($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($1|0)==(0|0);
 if ($2) {
  $$0 = 0;
 } else {
  $3 = HEAP32[$1>>2]|0;
  $4 = ((($1)) + 4|0);
  $5 = HEAP32[$4>>2]|0;
  $6 = (___mo_lookup($3,$5,$0)|0);
  $$0 = $6;
 }
 $7 = ($$0|0)==(0|0);
 $8 = $7 ? $0 : $$0;
 return ($8|0);
}
function ___mo_lookup($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$090 = 0, $$094 = 0, $$191 = 0, $$195 = 0, $$4 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond102 = 0, $or$cond104 = 0, $spec$select = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = HEAP32[$0>>2]|0;
 $4 = (($3) + 1794895138)|0;
 $5 = ((($0)) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (_swapc($6,$4)|0);
 $8 = ((($0)) + 12|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (_swapc($9,$4)|0);
 $11 = ((($0)) + 16|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = (_swapc($12,$4)|0);
 $14 = $1 >>> 2;
 $15 = ($7>>>0)<($14>>>0);
 L1: do {
  if ($15) {
   $16 = $7 << 2;
   $17 = (($1) - ($16))|0;
   $18 = ($10>>>0)<($17>>>0);
   $19 = ($13>>>0)<($17>>>0);
   $or$cond = $18 & $19;
   if ($or$cond) {
    $20 = $13 | $10;
    $21 = $20 & 3;
    $22 = ($21|0)==(0);
    if ($22) {
     $23 = $10 >>> 2;
     $24 = $13 >>> 2;
     $$090 = 0;$$094 = $7;
     while(1) {
      $25 = $$094 >>> 1;
      $26 = (($$090) + ($25))|0;
      $27 = $26 << 1;
      $28 = (($27) + ($23))|0;
      $29 = (($0) + ($28<<2)|0);
      $30 = HEAP32[$29>>2]|0;
      $31 = (_swapc($30,$4)|0);
      $32 = (($28) + 1)|0;
      $33 = (($0) + ($32<<2)|0);
      $34 = HEAP32[$33>>2]|0;
      $35 = (_swapc($34,$4)|0);
      $36 = ($35>>>0)<($1>>>0);
      $37 = (($1) - ($35))|0;
      $38 = ($31>>>0)<($37>>>0);
      $or$cond102 = $36 & $38;
      if (!($or$cond102)) {
       $$4 = 0;
       break L1;
      }
      $39 = (($35) + ($31))|0;
      $40 = (($0) + ($39)|0);
      $41 = HEAP8[$40>>0]|0;
      $42 = ($41<<24>>24)==(0);
      if (!($42)) {
       $$4 = 0;
       break L1;
      }
      $43 = (($0) + ($35)|0);
      $44 = (_strcmp($2,$43)|0);
      $45 = ($44|0)==(0);
      if ($45) {
       break;
      }
      $62 = ($$094|0)==(1);
      $63 = ($44|0)<(0);
      if ($62) {
       $$4 = 0;
       break L1;
      }
      $$191 = $63 ? $$090 : $26;
      $64 = (($$094) - ($25))|0;
      $$195 = $63 ? $25 : $64;
      $$090 = $$191;$$094 = $$195;
     }
     $46 = (($27) + ($24))|0;
     $47 = (($0) + ($46<<2)|0);
     $48 = HEAP32[$47>>2]|0;
     $49 = (_swapc($48,$4)|0);
     $50 = (($46) + 1)|0;
     $51 = (($0) + ($50<<2)|0);
     $52 = HEAP32[$51>>2]|0;
     $53 = (_swapc($52,$4)|0);
     $54 = ($53>>>0)<($1>>>0);
     $55 = (($1) - ($53))|0;
     $56 = ($49>>>0)<($55>>>0);
     $or$cond104 = $54 & $56;
     if ($or$cond104) {
      $57 = (($0) + ($53)|0);
      $58 = (($53) + ($49))|0;
      $59 = (($0) + ($58)|0);
      $60 = HEAP8[$59>>0]|0;
      $61 = ($60<<24>>24)==(0);
      $spec$select = $61 ? $57 : 0;
      $$4 = $spec$select;
     } else {
      $$4 = 0;
     }
    } else {
     $$4 = 0;
    }
   } else {
    $$4 = 0;
   }
  } else {
   $$4 = 0;
  }
 } while(0);
 return ($$4|0);
}
function _swapc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $spec$select = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($1|0)==(0);
 $3 = (_llvm_bswap_i32(($0|0))|0);
 $spec$select = $2 ? $0 : $3;
 return ($spec$select|0);
}
function ___fwritex($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$03846 = 0, $$042 = 0, $$1 = 0, $$139 = 0, $$141 = 0, $$143 = 0, $$pre = 0, $$pre48 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ((($2)) + 16|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($4|0)==(0|0);
 if ($5) {
  $7 = (___towrite($2)|0);
  $8 = ($7|0)==(0);
  if ($8) {
   $$pre = HEAP32[$3>>2]|0;
   $12 = $$pre;
   label = 5;
  } else {
   $$1 = 0;
  }
 } else {
  $6 = $4;
  $12 = $6;
  label = 5;
 }
 L5: do {
  if ((label|0) == 5) {
   $9 = ((($2)) + 20|0);
   $10 = HEAP32[$9>>2]|0;
   $11 = (($12) - ($10))|0;
   $13 = ($11>>>0)<($1>>>0);
   $14 = $10;
   if ($13) {
    $15 = ((($2)) + 36|0);
    $16 = HEAP32[$15>>2]|0;
    $17 = (FUNCTION_TABLE_iiii[$16 & 63]($2,$0,$1)|0);
    $$1 = $17;
    break;
   }
   $18 = ((($2)) + 75|0);
   $19 = HEAP8[$18>>0]|0;
   $20 = ($19<<24>>24)<(0);
   $21 = ($1|0)==(0);
   $or$cond = $20 | $21;
   L10: do {
    if ($or$cond) {
     $$139 = 0;$$141 = $0;$$143 = $1;$32 = $14;
    } else {
     $$03846 = $1;
     while(1) {
      $22 = (($$03846) + -1)|0;
      $24 = (($0) + ($22)|0);
      $25 = HEAP8[$24>>0]|0;
      $26 = ($25<<24>>24)==(10);
      if ($26) {
       break;
      }
      $23 = ($22|0)==(0);
      if ($23) {
       $$139 = 0;$$141 = $0;$$143 = $1;$32 = $14;
       break L10;
      } else {
       $$03846 = $22;
      }
     }
     $27 = ((($2)) + 36|0);
     $28 = HEAP32[$27>>2]|0;
     $29 = (FUNCTION_TABLE_iiii[$28 & 63]($2,$0,$$03846)|0);
     $30 = ($29>>>0)<($$03846>>>0);
     if ($30) {
      $$1 = $29;
      break L5;
     }
     $31 = (($0) + ($$03846)|0);
     $$042 = (($1) - ($$03846))|0;
     $$pre48 = HEAP32[$9>>2]|0;
     $$139 = $$03846;$$141 = $31;$$143 = $$042;$32 = $$pre48;
    }
   } while(0);
   (_memcpy(($32|0),($$141|0),($$143|0))|0);
   $33 = HEAP32[$9>>2]|0;
   $34 = (($33) + ($$143)|0);
   HEAP32[$9>>2] = $34;
   $35 = (($$139) + ($$143))|0;
   $$1 = $35;
  }
 } while(0);
 return ($$1|0);
}
function ___towrite($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 74|0);
 $2 = HEAP8[$1>>0]|0;
 $3 = $2 << 24 >> 24;
 $4 = (($3) + 255)|0;
 $5 = $4 | $3;
 $6 = $5&255;
 HEAP8[$1>>0] = $6;
 $7 = HEAP32[$0>>2]|0;
 $8 = $7 & 8;
 $9 = ($8|0)==(0);
 if ($9) {
  $11 = ((($0)) + 8|0);
  HEAP32[$11>>2] = 0;
  $12 = ((($0)) + 4|0);
  HEAP32[$12>>2] = 0;
  $13 = ((($0)) + 44|0);
  $14 = HEAP32[$13>>2]|0;
  $15 = ((($0)) + 28|0);
  HEAP32[$15>>2] = $14;
  $16 = ((($0)) + 20|0);
  HEAP32[$16>>2] = $14;
  $17 = $14;
  $18 = ((($0)) + 48|0);
  $19 = HEAP32[$18>>2]|0;
  $20 = (($17) + ($19)|0);
  $21 = ((($0)) + 16|0);
  HEAP32[$21>>2] = $20;
  $$0 = 0;
 } else {
  $10 = $7 | 32;
  HEAP32[$0>>2] = $10;
  $$0 = -1;
 }
 return ($$0|0);
}
function _strlen($0) {
 $0 = $0|0;
 var $$0 = 0, $$014 = 0, $$015$lcssa = 0, $$01518 = 0, $$1$lcssa = 0, $$pn = 0, $$pn29 = 0, $$pre = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0;
 var $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $0;
 $2 = $1 & 3;
 $3 = ($2|0)==(0);
 L1: do {
  if ($3) {
   $$015$lcssa = $0;
   label = 5;
  } else {
   $$01518 = $0;$22 = $1;
   while(1) {
    $4 = HEAP8[$$01518>>0]|0;
    $5 = ($4<<24>>24)==(0);
    if ($5) {
     $$pn = $22;
     break L1;
    }
    $6 = ((($$01518)) + 1|0);
    $7 = $6;
    $8 = $7 & 3;
    $9 = ($8|0)==(0);
    if ($9) {
     $$015$lcssa = $6;
     label = 5;
     break;
    } else {
     $$01518 = $6;$22 = $7;
    }
   }
  }
 } while(0);
 if ((label|0) == 5) {
  $$0 = $$015$lcssa;
  while(1) {
   $10 = HEAP32[$$0>>2]|0;
   $11 = (($10) + -16843009)|0;
   $12 = $10 & -2139062144;
   $13 = $12 ^ -2139062144;
   $14 = $13 & $11;
   $15 = ($14|0)==(0);
   $16 = ((($$0)) + 4|0);
   if ($15) {
    $$0 = $16;
   } else {
    break;
   }
  }
  $17 = $10&255;
  $18 = ($17<<24>>24)==(0);
  if ($18) {
   $$1$lcssa = $$0;
  } else {
   $$pn29 = $$0;
   while(1) {
    $19 = ((($$pn29)) + 1|0);
    $$pre = HEAP8[$19>>0]|0;
    $20 = ($$pre<<24>>24)==(0);
    if ($20) {
     $$1$lcssa = $19;
     break;
    } else {
     $$pn29 = $19;
    }
   }
  }
  $21 = $$1$lcssa;
  $$pn = $21;
 }
 $$014 = (($$pn) - ($1))|0;
 return ($$014|0);
}
function ___overflow($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $$pre = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = sp;
 $3 = $1&255;
 HEAP8[$2>>0] = $3;
 $4 = ((($0)) + 16|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = ($5|0)==(0|0);
 if ($6) {
  $7 = (___towrite($0)|0);
  $8 = ($7|0)==(0);
  if ($8) {
   $$pre = HEAP32[$4>>2]|0;
   $12 = $$pre;
   label = 4;
  } else {
   $$0 = -1;
  }
 } else {
  $12 = $5;
  label = 4;
 }
 do {
  if ((label|0) == 4) {
   $9 = ((($0)) + 20|0);
   $10 = HEAP32[$9>>2]|0;
   $11 = ($10>>>0)<($12>>>0);
   if ($11) {
    $13 = $1 & 255;
    $14 = ((($0)) + 75|0);
    $15 = HEAP8[$14>>0]|0;
    $16 = $15 << 24 >> 24;
    $17 = ($13|0)==($16|0);
    if (!($17)) {
     $18 = ((($10)) + 1|0);
     HEAP32[$9>>2] = $18;
     HEAP8[$10>>0] = $3;
     $$0 = $13;
     break;
    }
   }
   $19 = ((($0)) + 36|0);
   $20 = HEAP32[$19>>2]|0;
   $21 = (FUNCTION_TABLE_iiii[$20 & 63]($0,$2,1)|0);
   $22 = ($21|0)==(1);
   if ($22) {
    $23 = HEAP8[$2>>0]|0;
    $24 = $23&255;
    $$0 = $24;
   } else {
    $$0 = -1;
   }
  }
 } while(0);
 STACKTOP = sp;return ($$0|0);
}
function ___strdup($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (_strlen($0)|0);
 $2 = (($1) + 1)|0;
 $3 = (_malloc($2)|0);
 $4 = ($3|0)==(0|0);
 if ($4) {
  $$0 = 0;
 } else {
  $5 = (_memcpy(($3|0),($0|0),($2|0))|0);
  $$0 = $5;
 }
 return ($$0|0);
}
function ___ofl_lock() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___lock((7744|0));
 return (7752|0);
}
function ___ofl_unlock() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___unlock((7744|0));
 return;
}
function _fflush($0) {
 $0 = $0|0;
 var $$0 = 0, $$023 = 0, $$02325 = 0, $$02327 = 0, $$024$lcssa = 0, $$02426 = 0, $$1 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $phitmp = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0|0);
 do {
  if ($1) {
   $8 = HEAP32[821]|0;
   $9 = ($8|0)==(0|0);
   if ($9) {
    $29 = 0;
   } else {
    $10 = HEAP32[821]|0;
    $11 = (_fflush($10)|0);
    $29 = $11;
   }
   $12 = (___ofl_lock()|0);
   $$02325 = HEAP32[$12>>2]|0;
   $13 = ($$02325|0)==(0|0);
   if ($13) {
    $$024$lcssa = $29;
   } else {
    $$02327 = $$02325;$$02426 = $29;
    while(1) {
     $14 = ((($$02327)) + 76|0);
     $15 = HEAP32[$14>>2]|0;
     $16 = ($15|0)>(-1);
     if ($16) {
      $17 = (___lockfile($$02327)|0);
      $25 = $17;
     } else {
      $25 = 0;
     }
     $18 = ((($$02327)) + 20|0);
     $19 = HEAP32[$18>>2]|0;
     $20 = ((($$02327)) + 28|0);
     $21 = HEAP32[$20>>2]|0;
     $22 = ($19>>>0)>($21>>>0);
     if ($22) {
      $23 = (___fflush_unlocked($$02327)|0);
      $24 = $23 | $$02426;
      $$1 = $24;
     } else {
      $$1 = $$02426;
     }
     $26 = ($25|0)==(0);
     if (!($26)) {
      ___unlockfile($$02327);
     }
     $27 = ((($$02327)) + 56|0);
     $$023 = HEAP32[$27>>2]|0;
     $28 = ($$023|0)==(0|0);
     if ($28) {
      $$024$lcssa = $$1;
      break;
     } else {
      $$02327 = $$023;$$02426 = $$1;
     }
    }
   }
   ___ofl_unlock();
   $$0 = $$024$lcssa;
  } else {
   $2 = ((($0)) + 76|0);
   $3 = HEAP32[$2>>2]|0;
   $4 = ($3|0)>(-1);
   if (!($4)) {
    $5 = (___fflush_unlocked($0)|0);
    $$0 = $5;
    break;
   }
   $6 = (___lockfile($0)|0);
   $phitmp = ($6|0)==(0);
   $7 = (___fflush_unlocked($0)|0);
   if ($phitmp) {
    $$0 = $7;
   } else {
    ___unlockfile($0);
    $$0 = $7;
   }
  }
 } while(0);
 return ($$0|0);
}
function ___fflush_unlocked($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 20|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ((($0)) + 28|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($2>>>0)>($4>>>0);
 if ($5) {
  $6 = ((($0)) + 36|0);
  $7 = HEAP32[$6>>2]|0;
  (FUNCTION_TABLE_iiii[$7 & 63]($0,0,0)|0);
  $8 = HEAP32[$1>>2]|0;
  $9 = ($8|0)==(0|0);
  if ($9) {
   $$0 = -1;
  } else {
   label = 3;
  }
 } else {
  label = 3;
 }
 if ((label|0) == 3) {
  $10 = ((($0)) + 4|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = ((($0)) + 8|0);
  $13 = HEAP32[$12>>2]|0;
  $14 = ($11>>>0)<($13>>>0);
  if ($14) {
   $15 = $11;
   $16 = $13;
   $17 = (($15) - ($16))|0;
   $18 = ((($0)) + 40|0);
   $19 = HEAP32[$18>>2]|0;
   (FUNCTION_TABLE_iiii[$19 & 63]($0,$17,1)|0);
  }
  $20 = ((($0)) + 16|0);
  HEAP32[$20>>2] = 0;
  HEAP32[$3>>2] = 0;
  HEAP32[$1>>2] = 0;
  HEAP32[$12>>2] = 0;
  HEAP32[$10>>2] = 0;
  $$0 = 0;
 }
 return ($$0|0);
}
function _fputc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ((($1)) + 76|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = ($3|0)<(0);
 if ($4) {
  label = 3;
 } else {
  $5 = (___lockfile($1)|0);
  $6 = ($5|0)==(0);
  if ($6) {
   label = 3;
  } else {
   $20 = $0&255;
   $21 = $0 & 255;
   $22 = ((($1)) + 75|0);
   $23 = HEAP8[$22>>0]|0;
   $24 = $23 << 24 >> 24;
   $25 = ($21|0)==($24|0);
   if ($25) {
    label = 10;
   } else {
    $26 = ((($1)) + 20|0);
    $27 = HEAP32[$26>>2]|0;
    $28 = ((($1)) + 16|0);
    $29 = HEAP32[$28>>2]|0;
    $30 = ($27>>>0)<($29>>>0);
    if ($30) {
     $31 = ((($27)) + 1|0);
     HEAP32[$26>>2] = $31;
     HEAP8[$27>>0] = $20;
     $33 = $21;
    } else {
     label = 10;
    }
   }
   if ((label|0) == 10) {
    $32 = (___overflow($1,$0)|0);
    $33 = $32;
   }
   ___unlockfile($1);
   $$0 = $33;
  }
 }
 do {
  if ((label|0) == 3) {
   $7 = $0&255;
   $8 = $0 & 255;
   $9 = ((($1)) + 75|0);
   $10 = HEAP8[$9>>0]|0;
   $11 = $10 << 24 >> 24;
   $12 = ($8|0)==($11|0);
   if (!($12)) {
    $13 = ((($1)) + 20|0);
    $14 = HEAP32[$13>>2]|0;
    $15 = ((($1)) + 16|0);
    $16 = HEAP32[$15>>2]|0;
    $17 = ($14>>>0)<($16>>>0);
    if ($17) {
     $18 = ((($14)) + 1|0);
     HEAP32[$13>>2] = $18;
     HEAP8[$14>>0] = $7;
     $$0 = $8;
     break;
    }
   }
   $19 = (___overflow($1,$0)|0);
   $$0 = $19;
  }
 } while(0);
 return ($$0|0);
}
function _malloc($0) {
 $0 = $0|0;
 var $$0 = 0, $$0$i = 0, $$0$i$i = 0, $$0$i$i$i = 0, $$0$i20$i = 0, $$0169$i = 0, $$0170$i = 0, $$0171$i = 0, $$0192 = 0, $$0194 = 0, $$02014$i$i = 0, $$0202$lcssa$i$i = 0, $$02023$i$i = 0, $$0206$i$i = 0, $$0207$i$i = 0, $$024372$i = 0, $$0259$i$i = 0, $$02604$i$i = 0, $$0261$lcssa$i$i = 0, $$02613$i$i = 0;
 var $$0267$i$i = 0, $$0268$i$i = 0, $$0318$i = 0, $$032012$i = 0, $$0321$lcssa$i = 0, $$032111$i = 0, $$0323$i = 0, $$0329$i = 0, $$0335$i = 0, $$0336$i = 0, $$0338$i = 0, $$0339$i = 0, $$0344$i = 0, $$1174$i = 0, $$1174$i$be = 0, $$1174$i$ph = 0, $$1176$i = 0, $$1176$i$be = 0, $$1176$i$ph = 0, $$124471$i = 0;
 var $$1263$i$i = 0, $$1263$i$i$be = 0, $$1263$i$i$ph = 0, $$1265$i$i = 0, $$1265$i$i$be = 0, $$1265$i$i$ph = 0, $$1319$i = 0, $$1324$i = 0, $$1340$i = 0, $$1346$i = 0, $$1346$i$be = 0, $$1346$i$ph = 0, $$1350$i = 0, $$1350$i$be = 0, $$1350$i$ph = 0, $$2234243136$i = 0, $$2247$ph$i = 0, $$2253$ph$i = 0, $$2331$i = 0, $$3$i = 0;
 var $$3$i$i = 0, $$3$i198 = 0, $$3$i198211 = 0, $$3326$i = 0, $$3348$i = 0, $$4$lcssa$i = 0, $$415$i = 0, $$415$i$ph = 0, $$4236$i = 0, $$4327$lcssa$i = 0, $$432714$i = 0, $$432714$i$ph = 0, $$4333$i = 0, $$533413$i = 0, $$533413$i$ph = 0, $$723947$i = 0, $$748$i = 0, $$pre = 0, $$pre$i = 0, $$pre$i$i = 0;
 var $$pre$i16$i = 0, $$pre$i195 = 0, $$pre$i204 = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i17$iZ2D = 0, $$pre$phi$i205Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phiZ2D = 0, $$sink = 0, $$sink320 = 0, $$sink321 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0;
 var $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0;
 var $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0;
 var $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0;
 var $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0;
 var $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0;
 var $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0;
 var $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0;
 var $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0;
 var $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0;
 var $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0;
 var $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0;
 var $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0;
 var $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0;
 var $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0;
 var $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0;
 var $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0;
 var $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0;
 var $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0;
 var $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0;
 var $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0, $460 = 0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0;
 var $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0, $48 = 0, $480 = 0, $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0;
 var $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0, $498 = 0, $499 = 0, $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0;
 var $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0;
 var $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0, $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0;
 var $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0;
 var $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0;
 var $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0;
 var $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0, $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0;
 var $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0, $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0;
 var $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0, $641 = 0, $642 = 0, $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0;
 var $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0, $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0;
 var $666 = 0, $667 = 0, $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0, $677 = 0, $678 = 0, $679 = 0, $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0;
 var $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0, $695 = 0, $696 = 0, $697 = 0, $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0;
 var $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0, $712 = 0, $713 = 0, $714 = 0, $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0;
 var $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0, $727 = 0, $728 = 0, $729 = 0, $73 = 0, $730 = 0, $731 = 0, $732 = 0, $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0;
 var $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0, $749 = 0, $75 = 0, $750 = 0, $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0;
 var $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0, $766 = 0, $767 = 0, $768 = 0, $769 = 0, $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0;
 var $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0, $785 = 0, $786 = 0, $787 = 0, $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0;
 var $792 = 0, $793 = 0, $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0, $802 = 0, $803 = 0, $804 = 0, $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0;
 var $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0, $820 = 0, $821 = 0, $822 = 0, $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0;
 var $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0, $838 = 0, $839 = 0, $84 = 0, $840 = 0, $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0;
 var $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0, $856 = 0, $857 = 0, $858 = 0, $859 = 0, $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0;
 var $864 = 0, $865 = 0, $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0, $874 = 0, $875 = 0, $876 = 0, $877 = 0, $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0;
 var $882 = 0, $883 = 0, $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0, $892 = 0, $893 = 0, $894 = 0, $895 = 0, $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0;
 var $90 = 0, $900 = 0, $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0, $91 = 0, $910 = 0, $911 = 0, $912 = 0, $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0;
 var $918 = 0, $919 = 0, $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0, $928 = 0, $929 = 0, $93 = 0, $930 = 0, $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0;
 var $936 = 0, $937 = 0, $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0, $946 = 0, $947 = 0, $948 = 0, $949 = 0, $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0;
 var $954 = 0, $955 = 0, $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0, $964 = 0, $965 = 0, $966 = 0, $967 = 0, $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0;
 var $972 = 0, $973 = 0, $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $99 = 0, $cond$i = 0, $cond$i$i = 0, $cond$i203 = 0, $not$$i = 0, $or$cond$i = 0, $or$cond$i199 = 0, $or$cond1$i = 0, $or$cond1$i197 = 0, $or$cond11$i = 0, $or$cond2$i = 0;
 var $or$cond5$i = 0, $or$cond50$i = 0, $or$cond51$i = 0, $or$cond6$i = 0, $or$cond7$i = 0, $or$cond8$i = 0, $or$cond8$not$i = 0, $spec$select$i = 0, $spec$select$i201 = 0, $spec$select1$i = 0, $spec$select2$i = 0, $spec$select4$i = 0, $spec$select49$i = 0, $spec$select9$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp;
 $2 = ($0>>>0)<(245);
 do {
  if ($2) {
   $3 = ($0>>>0)<(11);
   $4 = (($0) + 11)|0;
   $5 = $4 & -8;
   $6 = $3 ? 16 : $5;
   $7 = $6 >>> 3;
   $8 = HEAP32[1939]|0;
   $9 = $8 >>> $7;
   $10 = $9 & 3;
   $11 = ($10|0)==(0);
   if (!($11)) {
    $12 = $9 & 1;
    $13 = $12 ^ 1;
    $14 = (($13) + ($7))|0;
    $15 = $14 << 1;
    $16 = (7796 + ($15<<2)|0);
    $17 = ((($16)) + 8|0);
    $18 = HEAP32[$17>>2]|0;
    $19 = ((($18)) + 8|0);
    $20 = HEAP32[$19>>2]|0;
    $21 = ($20|0)==($16|0);
    if ($21) {
     $22 = 1 << $14;
     $23 = $22 ^ -1;
     $24 = $8 & $23;
     HEAP32[1939] = $24;
    } else {
     $25 = ((($20)) + 12|0);
     HEAP32[$25>>2] = $16;
     HEAP32[$17>>2] = $20;
    }
    $26 = $14 << 3;
    $27 = $26 | 3;
    $28 = ((($18)) + 4|0);
    HEAP32[$28>>2] = $27;
    $29 = (($18) + ($26)|0);
    $30 = ((($29)) + 4|0);
    $31 = HEAP32[$30>>2]|0;
    $32 = $31 | 1;
    HEAP32[$30>>2] = $32;
    $$0 = $19;
    STACKTOP = sp;return ($$0|0);
   }
   $33 = HEAP32[(7764)>>2]|0;
   $34 = ($6>>>0)>($33>>>0);
   if ($34) {
    $35 = ($9|0)==(0);
    if (!($35)) {
     $36 = $9 << $7;
     $37 = 2 << $7;
     $38 = (0 - ($37))|0;
     $39 = $37 | $38;
     $40 = $36 & $39;
     $41 = (0 - ($40))|0;
     $42 = $40 & $41;
     $43 = (($42) + -1)|0;
     $44 = $43 >>> 12;
     $45 = $44 & 16;
     $46 = $43 >>> $45;
     $47 = $46 >>> 5;
     $48 = $47 & 8;
     $49 = $48 | $45;
     $50 = $46 >>> $48;
     $51 = $50 >>> 2;
     $52 = $51 & 4;
     $53 = $49 | $52;
     $54 = $50 >>> $52;
     $55 = $54 >>> 1;
     $56 = $55 & 2;
     $57 = $53 | $56;
     $58 = $54 >>> $56;
     $59 = $58 >>> 1;
     $60 = $59 & 1;
     $61 = $57 | $60;
     $62 = $58 >>> $60;
     $63 = (($61) + ($62))|0;
     $64 = $63 << 1;
     $65 = (7796 + ($64<<2)|0);
     $66 = ((($65)) + 8|0);
     $67 = HEAP32[$66>>2]|0;
     $68 = ((($67)) + 8|0);
     $69 = HEAP32[$68>>2]|0;
     $70 = ($69|0)==($65|0);
     if ($70) {
      $71 = 1 << $63;
      $72 = $71 ^ -1;
      $73 = $8 & $72;
      HEAP32[1939] = $73;
      $90 = $73;
     } else {
      $74 = ((($69)) + 12|0);
      HEAP32[$74>>2] = $65;
      HEAP32[$66>>2] = $69;
      $90 = $8;
     }
     $75 = $63 << 3;
     $76 = (($75) - ($6))|0;
     $77 = $6 | 3;
     $78 = ((($67)) + 4|0);
     HEAP32[$78>>2] = $77;
     $79 = (($67) + ($6)|0);
     $80 = $76 | 1;
     $81 = ((($79)) + 4|0);
     HEAP32[$81>>2] = $80;
     $82 = (($67) + ($75)|0);
     HEAP32[$82>>2] = $76;
     $83 = ($33|0)==(0);
     if (!($83)) {
      $84 = HEAP32[(7776)>>2]|0;
      $85 = $33 >>> 3;
      $86 = $85 << 1;
      $87 = (7796 + ($86<<2)|0);
      $88 = 1 << $85;
      $89 = $90 & $88;
      $91 = ($89|0)==(0);
      if ($91) {
       $92 = $90 | $88;
       HEAP32[1939] = $92;
       $$pre = ((($87)) + 8|0);
       $$0194 = $87;$$pre$phiZ2D = $$pre;
      } else {
       $93 = ((($87)) + 8|0);
       $94 = HEAP32[$93>>2]|0;
       $$0194 = $94;$$pre$phiZ2D = $93;
      }
      HEAP32[$$pre$phiZ2D>>2] = $84;
      $95 = ((($$0194)) + 12|0);
      HEAP32[$95>>2] = $84;
      $96 = ((($84)) + 8|0);
      HEAP32[$96>>2] = $$0194;
      $97 = ((($84)) + 12|0);
      HEAP32[$97>>2] = $87;
     }
     HEAP32[(7764)>>2] = $76;
     HEAP32[(7776)>>2] = $79;
     $$0 = $68;
     STACKTOP = sp;return ($$0|0);
    }
    $98 = HEAP32[(7760)>>2]|0;
    $99 = ($98|0)==(0);
    if ($99) {
     $$0192 = $6;
    } else {
     $100 = (0 - ($98))|0;
     $101 = $98 & $100;
     $102 = (($101) + -1)|0;
     $103 = $102 >>> 12;
     $104 = $103 & 16;
     $105 = $102 >>> $104;
     $106 = $105 >>> 5;
     $107 = $106 & 8;
     $108 = $107 | $104;
     $109 = $105 >>> $107;
     $110 = $109 >>> 2;
     $111 = $110 & 4;
     $112 = $108 | $111;
     $113 = $109 >>> $111;
     $114 = $113 >>> 1;
     $115 = $114 & 2;
     $116 = $112 | $115;
     $117 = $113 >>> $115;
     $118 = $117 >>> 1;
     $119 = $118 & 1;
     $120 = $116 | $119;
     $121 = $117 >>> $119;
     $122 = (($120) + ($121))|0;
     $123 = (8060 + ($122<<2)|0);
     $124 = HEAP32[$123>>2]|0;
     $125 = ((($124)) + 4|0);
     $126 = HEAP32[$125>>2]|0;
     $127 = $126 & -8;
     $128 = (($127) - ($6))|0;
     $$0169$i = $124;$$0170$i = $124;$$0171$i = $128;
     while(1) {
      $129 = ((($$0169$i)) + 16|0);
      $130 = HEAP32[$129>>2]|0;
      $131 = ($130|0)==(0|0);
      if ($131) {
       $132 = ((($$0169$i)) + 20|0);
       $133 = HEAP32[$132>>2]|0;
       $134 = ($133|0)==(0|0);
       if ($134) {
        break;
       } else {
        $136 = $133;
       }
      } else {
       $136 = $130;
      }
      $135 = ((($136)) + 4|0);
      $137 = HEAP32[$135>>2]|0;
      $138 = $137 & -8;
      $139 = (($138) - ($6))|0;
      $140 = ($139>>>0)<($$0171$i>>>0);
      $spec$select$i = $140 ? $139 : $$0171$i;
      $spec$select1$i = $140 ? $136 : $$0170$i;
      $$0169$i = $136;$$0170$i = $spec$select1$i;$$0171$i = $spec$select$i;
     }
     $141 = (($$0170$i) + ($6)|0);
     $142 = ($141>>>0)>($$0170$i>>>0);
     if ($142) {
      $143 = ((($$0170$i)) + 24|0);
      $144 = HEAP32[$143>>2]|0;
      $145 = ((($$0170$i)) + 12|0);
      $146 = HEAP32[$145>>2]|0;
      $147 = ($146|0)==($$0170$i|0);
      do {
       if ($147) {
        $152 = ((($$0170$i)) + 20|0);
        $153 = HEAP32[$152>>2]|0;
        $154 = ($153|0)==(0|0);
        if ($154) {
         $155 = ((($$0170$i)) + 16|0);
         $156 = HEAP32[$155>>2]|0;
         $157 = ($156|0)==(0|0);
         if ($157) {
          $$3$i = 0;
          break;
         } else {
          $$1174$i$ph = $156;$$1176$i$ph = $155;
         }
        } else {
         $$1174$i$ph = $153;$$1176$i$ph = $152;
        }
        $$1174$i = $$1174$i$ph;$$1176$i = $$1176$i$ph;
        while(1) {
         $158 = ((($$1174$i)) + 20|0);
         $159 = HEAP32[$158>>2]|0;
         $160 = ($159|0)==(0|0);
         if ($160) {
          $161 = ((($$1174$i)) + 16|0);
          $162 = HEAP32[$161>>2]|0;
          $163 = ($162|0)==(0|0);
          if ($163) {
           break;
          } else {
           $$1174$i$be = $162;$$1176$i$be = $161;
          }
         } else {
          $$1174$i$be = $159;$$1176$i$be = $158;
         }
         $$1174$i = $$1174$i$be;$$1176$i = $$1176$i$be;
        }
        HEAP32[$$1176$i>>2] = 0;
        $$3$i = $$1174$i;
       } else {
        $148 = ((($$0170$i)) + 8|0);
        $149 = HEAP32[$148>>2]|0;
        $150 = ((($149)) + 12|0);
        HEAP32[$150>>2] = $146;
        $151 = ((($146)) + 8|0);
        HEAP32[$151>>2] = $149;
        $$3$i = $146;
       }
      } while(0);
      $164 = ($144|0)==(0|0);
      do {
       if (!($164)) {
        $165 = ((($$0170$i)) + 28|0);
        $166 = HEAP32[$165>>2]|0;
        $167 = (8060 + ($166<<2)|0);
        $168 = HEAP32[$167>>2]|0;
        $169 = ($$0170$i|0)==($168|0);
        if ($169) {
         HEAP32[$167>>2] = $$3$i;
         $cond$i = ($$3$i|0)==(0|0);
         if ($cond$i) {
          $170 = 1 << $166;
          $171 = $170 ^ -1;
          $172 = $98 & $171;
          HEAP32[(7760)>>2] = $172;
          break;
         }
        } else {
         $173 = ((($144)) + 16|0);
         $174 = HEAP32[$173>>2]|0;
         $175 = ($174|0)==($$0170$i|0);
         $176 = ((($144)) + 20|0);
         $$sink = $175 ? $173 : $176;
         HEAP32[$$sink>>2] = $$3$i;
         $177 = ($$3$i|0)==(0|0);
         if ($177) {
          break;
         }
        }
        $178 = ((($$3$i)) + 24|0);
        HEAP32[$178>>2] = $144;
        $179 = ((($$0170$i)) + 16|0);
        $180 = HEAP32[$179>>2]|0;
        $181 = ($180|0)==(0|0);
        if (!($181)) {
         $182 = ((($$3$i)) + 16|0);
         HEAP32[$182>>2] = $180;
         $183 = ((($180)) + 24|0);
         HEAP32[$183>>2] = $$3$i;
        }
        $184 = ((($$0170$i)) + 20|0);
        $185 = HEAP32[$184>>2]|0;
        $186 = ($185|0)==(0|0);
        if (!($186)) {
         $187 = ((($$3$i)) + 20|0);
         HEAP32[$187>>2] = $185;
         $188 = ((($185)) + 24|0);
         HEAP32[$188>>2] = $$3$i;
        }
       }
      } while(0);
      $189 = ($$0171$i>>>0)<(16);
      if ($189) {
       $190 = (($$0171$i) + ($6))|0;
       $191 = $190 | 3;
       $192 = ((($$0170$i)) + 4|0);
       HEAP32[$192>>2] = $191;
       $193 = (($$0170$i) + ($190)|0);
       $194 = ((($193)) + 4|0);
       $195 = HEAP32[$194>>2]|0;
       $196 = $195 | 1;
       HEAP32[$194>>2] = $196;
      } else {
       $197 = $6 | 3;
       $198 = ((($$0170$i)) + 4|0);
       HEAP32[$198>>2] = $197;
       $199 = $$0171$i | 1;
       $200 = ((($141)) + 4|0);
       HEAP32[$200>>2] = $199;
       $201 = (($141) + ($$0171$i)|0);
       HEAP32[$201>>2] = $$0171$i;
       $202 = ($33|0)==(0);
       if (!($202)) {
        $203 = HEAP32[(7776)>>2]|0;
        $204 = $33 >>> 3;
        $205 = $204 << 1;
        $206 = (7796 + ($205<<2)|0);
        $207 = 1 << $204;
        $208 = $207 & $8;
        $209 = ($208|0)==(0);
        if ($209) {
         $210 = $207 | $8;
         HEAP32[1939] = $210;
         $$pre$i = ((($206)) + 8|0);
         $$0$i = $206;$$pre$phi$iZ2D = $$pre$i;
        } else {
         $211 = ((($206)) + 8|0);
         $212 = HEAP32[$211>>2]|0;
         $$0$i = $212;$$pre$phi$iZ2D = $211;
        }
        HEAP32[$$pre$phi$iZ2D>>2] = $203;
        $213 = ((($$0$i)) + 12|0);
        HEAP32[$213>>2] = $203;
        $214 = ((($203)) + 8|0);
        HEAP32[$214>>2] = $$0$i;
        $215 = ((($203)) + 12|0);
        HEAP32[$215>>2] = $206;
       }
       HEAP32[(7764)>>2] = $$0171$i;
       HEAP32[(7776)>>2] = $141;
      }
      $216 = ((($$0170$i)) + 8|0);
      $$0 = $216;
      STACKTOP = sp;return ($$0|0);
     } else {
      $$0192 = $6;
     }
    }
   } else {
    $$0192 = $6;
   }
  } else {
   $217 = ($0>>>0)>(4294967231);
   if ($217) {
    $$0192 = -1;
   } else {
    $218 = (($0) + 11)|0;
    $219 = $218 & -8;
    $220 = HEAP32[(7760)>>2]|0;
    $221 = ($220|0)==(0);
    if ($221) {
     $$0192 = $219;
    } else {
     $222 = (0 - ($219))|0;
     $223 = $218 >>> 8;
     $224 = ($223|0)==(0);
     if ($224) {
      $$0335$i = 0;
     } else {
      $225 = ($219>>>0)>(16777215);
      if ($225) {
       $$0335$i = 31;
      } else {
       $226 = (($223) + 1048320)|0;
       $227 = $226 >>> 16;
       $228 = $227 & 8;
       $229 = $223 << $228;
       $230 = (($229) + 520192)|0;
       $231 = $230 >>> 16;
       $232 = $231 & 4;
       $233 = $232 | $228;
       $234 = $229 << $232;
       $235 = (($234) + 245760)|0;
       $236 = $235 >>> 16;
       $237 = $236 & 2;
       $238 = $233 | $237;
       $239 = (14 - ($238))|0;
       $240 = $234 << $237;
       $241 = $240 >>> 15;
       $242 = (($239) + ($241))|0;
       $243 = $242 << 1;
       $244 = (($242) + 7)|0;
       $245 = $219 >>> $244;
       $246 = $245 & 1;
       $247 = $246 | $243;
       $$0335$i = $247;
      }
     }
     $248 = (8060 + ($$0335$i<<2)|0);
     $249 = HEAP32[$248>>2]|0;
     $250 = ($249|0)==(0|0);
     L79: do {
      if ($250) {
       $$2331$i = 0;$$3$i198 = 0;$$3326$i = $222;
       label = 61;
      } else {
       $251 = ($$0335$i|0)==(31);
       $252 = $$0335$i >>> 1;
       $253 = (25 - ($252))|0;
       $254 = $251 ? 0 : $253;
       $255 = $219 << $254;
       $$0318$i = 0;$$0323$i = $222;$$0329$i = $249;$$0336$i = $255;$$0339$i = 0;
       while(1) {
        $256 = ((($$0329$i)) + 4|0);
        $257 = HEAP32[$256>>2]|0;
        $258 = $257 & -8;
        $259 = (($258) - ($219))|0;
        $260 = ($259>>>0)<($$0323$i>>>0);
        if ($260) {
         $261 = ($259|0)==(0);
         if ($261) {
          $$415$i$ph = $$0329$i;$$432714$i$ph = 0;$$533413$i$ph = $$0329$i;
          label = 65;
          break L79;
         } else {
          $$1319$i = $$0329$i;$$1324$i = $259;
         }
        } else {
         $$1319$i = $$0318$i;$$1324$i = $$0323$i;
        }
        $262 = ((($$0329$i)) + 20|0);
        $263 = HEAP32[$262>>2]|0;
        $264 = $$0336$i >>> 31;
        $265 = (((($$0329$i)) + 16|0) + ($264<<2)|0);
        $266 = HEAP32[$265>>2]|0;
        $267 = ($263|0)==(0|0);
        $268 = ($263|0)==($266|0);
        $or$cond1$i197 = $267 | $268;
        $$1340$i = $or$cond1$i197 ? $$0339$i : $263;
        $269 = ($266|0)==(0|0);
        $spec$select4$i = $$0336$i << 1;
        if ($269) {
         $$2331$i = $$1340$i;$$3$i198 = $$1319$i;$$3326$i = $$1324$i;
         label = 61;
         break;
        } else {
         $$0318$i = $$1319$i;$$0323$i = $$1324$i;$$0329$i = $266;$$0336$i = $spec$select4$i;$$0339$i = $$1340$i;
        }
       }
      }
     } while(0);
     if ((label|0) == 61) {
      $270 = ($$2331$i|0)==(0|0);
      $271 = ($$3$i198|0)==(0|0);
      $or$cond$i199 = $270 & $271;
      if ($or$cond$i199) {
       $272 = 2 << $$0335$i;
       $273 = (0 - ($272))|0;
       $274 = $272 | $273;
       $275 = $274 & $220;
       $276 = ($275|0)==(0);
       if ($276) {
        $$0192 = $219;
        break;
       }
       $277 = (0 - ($275))|0;
       $278 = $275 & $277;
       $279 = (($278) + -1)|0;
       $280 = $279 >>> 12;
       $281 = $280 & 16;
       $282 = $279 >>> $281;
       $283 = $282 >>> 5;
       $284 = $283 & 8;
       $285 = $284 | $281;
       $286 = $282 >>> $284;
       $287 = $286 >>> 2;
       $288 = $287 & 4;
       $289 = $285 | $288;
       $290 = $286 >>> $288;
       $291 = $290 >>> 1;
       $292 = $291 & 2;
       $293 = $289 | $292;
       $294 = $290 >>> $292;
       $295 = $294 >>> 1;
       $296 = $295 & 1;
       $297 = $293 | $296;
       $298 = $294 >>> $296;
       $299 = (($297) + ($298))|0;
       $300 = (8060 + ($299<<2)|0);
       $301 = HEAP32[$300>>2]|0;
       $$3$i198211 = 0;$$4333$i = $301;
      } else {
       $$3$i198211 = $$3$i198;$$4333$i = $$2331$i;
      }
      $302 = ($$4333$i|0)==(0|0);
      if ($302) {
       $$4$lcssa$i = $$3$i198211;$$4327$lcssa$i = $$3326$i;
      } else {
       $$415$i$ph = $$3$i198211;$$432714$i$ph = $$3326$i;$$533413$i$ph = $$4333$i;
       label = 65;
      }
     }
     if ((label|0) == 65) {
      $$415$i = $$415$i$ph;$$432714$i = $$432714$i$ph;$$533413$i = $$533413$i$ph;
      while(1) {
       $303 = ((($$533413$i)) + 4|0);
       $304 = HEAP32[$303>>2]|0;
       $305 = $304 & -8;
       $306 = (($305) - ($219))|0;
       $307 = ($306>>>0)<($$432714$i>>>0);
       $spec$select$i201 = $307 ? $306 : $$432714$i;
       $spec$select2$i = $307 ? $$533413$i : $$415$i;
       $308 = ((($$533413$i)) + 16|0);
       $309 = HEAP32[$308>>2]|0;
       $310 = ($309|0)==(0|0);
       if ($310) {
        $311 = ((($$533413$i)) + 20|0);
        $312 = HEAP32[$311>>2]|0;
        $313 = $312;
       } else {
        $313 = $309;
       }
       $314 = ($313|0)==(0|0);
       if ($314) {
        $$4$lcssa$i = $spec$select2$i;$$4327$lcssa$i = $spec$select$i201;
        break;
       } else {
        $$415$i = $spec$select2$i;$$432714$i = $spec$select$i201;$$533413$i = $313;
       }
      }
     }
     $315 = ($$4$lcssa$i|0)==(0|0);
     if ($315) {
      $$0192 = $219;
     } else {
      $316 = HEAP32[(7764)>>2]|0;
      $317 = (($316) - ($219))|0;
      $318 = ($$4327$lcssa$i>>>0)<($317>>>0);
      if ($318) {
       $319 = (($$4$lcssa$i) + ($219)|0);
       $320 = ($319>>>0)>($$4$lcssa$i>>>0);
       if ($320) {
        $321 = ((($$4$lcssa$i)) + 24|0);
        $322 = HEAP32[$321>>2]|0;
        $323 = ((($$4$lcssa$i)) + 12|0);
        $324 = HEAP32[$323>>2]|0;
        $325 = ($324|0)==($$4$lcssa$i|0);
        do {
         if ($325) {
          $330 = ((($$4$lcssa$i)) + 20|0);
          $331 = HEAP32[$330>>2]|0;
          $332 = ($331|0)==(0|0);
          if ($332) {
           $333 = ((($$4$lcssa$i)) + 16|0);
           $334 = HEAP32[$333>>2]|0;
           $335 = ($334|0)==(0|0);
           if ($335) {
            $$3348$i = 0;
            break;
           } else {
            $$1346$i$ph = $334;$$1350$i$ph = $333;
           }
          } else {
           $$1346$i$ph = $331;$$1350$i$ph = $330;
          }
          $$1346$i = $$1346$i$ph;$$1350$i = $$1350$i$ph;
          while(1) {
           $336 = ((($$1346$i)) + 20|0);
           $337 = HEAP32[$336>>2]|0;
           $338 = ($337|0)==(0|0);
           if ($338) {
            $339 = ((($$1346$i)) + 16|0);
            $340 = HEAP32[$339>>2]|0;
            $341 = ($340|0)==(0|0);
            if ($341) {
             break;
            } else {
             $$1346$i$be = $340;$$1350$i$be = $339;
            }
           } else {
            $$1346$i$be = $337;$$1350$i$be = $336;
           }
           $$1346$i = $$1346$i$be;$$1350$i = $$1350$i$be;
          }
          HEAP32[$$1350$i>>2] = 0;
          $$3348$i = $$1346$i;
         } else {
          $326 = ((($$4$lcssa$i)) + 8|0);
          $327 = HEAP32[$326>>2]|0;
          $328 = ((($327)) + 12|0);
          HEAP32[$328>>2] = $324;
          $329 = ((($324)) + 8|0);
          HEAP32[$329>>2] = $327;
          $$3348$i = $324;
         }
        } while(0);
        $342 = ($322|0)==(0|0);
        do {
         if ($342) {
          $425 = $220;
         } else {
          $343 = ((($$4$lcssa$i)) + 28|0);
          $344 = HEAP32[$343>>2]|0;
          $345 = (8060 + ($344<<2)|0);
          $346 = HEAP32[$345>>2]|0;
          $347 = ($$4$lcssa$i|0)==($346|0);
          if ($347) {
           HEAP32[$345>>2] = $$3348$i;
           $cond$i203 = ($$3348$i|0)==(0|0);
           if ($cond$i203) {
            $348 = 1 << $344;
            $349 = $348 ^ -1;
            $350 = $220 & $349;
            HEAP32[(7760)>>2] = $350;
            $425 = $350;
            break;
           }
          } else {
           $351 = ((($322)) + 16|0);
           $352 = HEAP32[$351>>2]|0;
           $353 = ($352|0)==($$4$lcssa$i|0);
           $354 = ((($322)) + 20|0);
           $$sink320 = $353 ? $351 : $354;
           HEAP32[$$sink320>>2] = $$3348$i;
           $355 = ($$3348$i|0)==(0|0);
           if ($355) {
            $425 = $220;
            break;
           }
          }
          $356 = ((($$3348$i)) + 24|0);
          HEAP32[$356>>2] = $322;
          $357 = ((($$4$lcssa$i)) + 16|0);
          $358 = HEAP32[$357>>2]|0;
          $359 = ($358|0)==(0|0);
          if (!($359)) {
           $360 = ((($$3348$i)) + 16|0);
           HEAP32[$360>>2] = $358;
           $361 = ((($358)) + 24|0);
           HEAP32[$361>>2] = $$3348$i;
          }
          $362 = ((($$4$lcssa$i)) + 20|0);
          $363 = HEAP32[$362>>2]|0;
          $364 = ($363|0)==(0|0);
          if ($364) {
           $425 = $220;
          } else {
           $365 = ((($$3348$i)) + 20|0);
           HEAP32[$365>>2] = $363;
           $366 = ((($363)) + 24|0);
           HEAP32[$366>>2] = $$3348$i;
           $425 = $220;
          }
         }
        } while(0);
        $367 = ($$4327$lcssa$i>>>0)<(16);
        L128: do {
         if ($367) {
          $368 = (($$4327$lcssa$i) + ($219))|0;
          $369 = $368 | 3;
          $370 = ((($$4$lcssa$i)) + 4|0);
          HEAP32[$370>>2] = $369;
          $371 = (($$4$lcssa$i) + ($368)|0);
          $372 = ((($371)) + 4|0);
          $373 = HEAP32[$372>>2]|0;
          $374 = $373 | 1;
          HEAP32[$372>>2] = $374;
         } else {
          $375 = $219 | 3;
          $376 = ((($$4$lcssa$i)) + 4|0);
          HEAP32[$376>>2] = $375;
          $377 = $$4327$lcssa$i | 1;
          $378 = ((($319)) + 4|0);
          HEAP32[$378>>2] = $377;
          $379 = (($319) + ($$4327$lcssa$i)|0);
          HEAP32[$379>>2] = $$4327$lcssa$i;
          $380 = $$4327$lcssa$i >>> 3;
          $381 = ($$4327$lcssa$i>>>0)<(256);
          if ($381) {
           $382 = $380 << 1;
           $383 = (7796 + ($382<<2)|0);
           $384 = HEAP32[1939]|0;
           $385 = 1 << $380;
           $386 = $384 & $385;
           $387 = ($386|0)==(0);
           if ($387) {
            $388 = $384 | $385;
            HEAP32[1939] = $388;
            $$pre$i204 = ((($383)) + 8|0);
            $$0344$i = $383;$$pre$phi$i205Z2D = $$pre$i204;
           } else {
            $389 = ((($383)) + 8|0);
            $390 = HEAP32[$389>>2]|0;
            $$0344$i = $390;$$pre$phi$i205Z2D = $389;
           }
           HEAP32[$$pre$phi$i205Z2D>>2] = $319;
           $391 = ((($$0344$i)) + 12|0);
           HEAP32[$391>>2] = $319;
           $392 = ((($319)) + 8|0);
           HEAP32[$392>>2] = $$0344$i;
           $393 = ((($319)) + 12|0);
           HEAP32[$393>>2] = $383;
           break;
          }
          $394 = $$4327$lcssa$i >>> 8;
          $395 = ($394|0)==(0);
          if ($395) {
           $$0338$i = 0;
          } else {
           $396 = ($$4327$lcssa$i>>>0)>(16777215);
           if ($396) {
            $$0338$i = 31;
           } else {
            $397 = (($394) + 1048320)|0;
            $398 = $397 >>> 16;
            $399 = $398 & 8;
            $400 = $394 << $399;
            $401 = (($400) + 520192)|0;
            $402 = $401 >>> 16;
            $403 = $402 & 4;
            $404 = $403 | $399;
            $405 = $400 << $403;
            $406 = (($405) + 245760)|0;
            $407 = $406 >>> 16;
            $408 = $407 & 2;
            $409 = $404 | $408;
            $410 = (14 - ($409))|0;
            $411 = $405 << $408;
            $412 = $411 >>> 15;
            $413 = (($410) + ($412))|0;
            $414 = $413 << 1;
            $415 = (($413) + 7)|0;
            $416 = $$4327$lcssa$i >>> $415;
            $417 = $416 & 1;
            $418 = $417 | $414;
            $$0338$i = $418;
           }
          }
          $419 = (8060 + ($$0338$i<<2)|0);
          $420 = ((($319)) + 28|0);
          HEAP32[$420>>2] = $$0338$i;
          $421 = ((($319)) + 16|0);
          $422 = ((($421)) + 4|0);
          HEAP32[$422>>2] = 0;
          HEAP32[$421>>2] = 0;
          $423 = 1 << $$0338$i;
          $424 = $425 & $423;
          $426 = ($424|0)==(0);
          if ($426) {
           $427 = $425 | $423;
           HEAP32[(7760)>>2] = $427;
           HEAP32[$419>>2] = $319;
           $428 = ((($319)) + 24|0);
           HEAP32[$428>>2] = $419;
           $429 = ((($319)) + 12|0);
           HEAP32[$429>>2] = $319;
           $430 = ((($319)) + 8|0);
           HEAP32[$430>>2] = $319;
           break;
          }
          $431 = HEAP32[$419>>2]|0;
          $432 = ((($431)) + 4|0);
          $433 = HEAP32[$432>>2]|0;
          $434 = $433 & -8;
          $435 = ($434|0)==($$4327$lcssa$i|0);
          L145: do {
           if ($435) {
            $$0321$lcssa$i = $431;
           } else {
            $436 = ($$0338$i|0)==(31);
            $437 = $$0338$i >>> 1;
            $438 = (25 - ($437))|0;
            $439 = $436 ? 0 : $438;
            $440 = $$4327$lcssa$i << $439;
            $$032012$i = $440;$$032111$i = $431;
            while(1) {
             $447 = $$032012$i >>> 31;
             $448 = (((($$032111$i)) + 16|0) + ($447<<2)|0);
             $443 = HEAP32[$448>>2]|0;
             $449 = ($443|0)==(0|0);
             if ($449) {
              break;
             }
             $441 = $$032012$i << 1;
             $442 = ((($443)) + 4|0);
             $444 = HEAP32[$442>>2]|0;
             $445 = $444 & -8;
             $446 = ($445|0)==($$4327$lcssa$i|0);
             if ($446) {
              $$0321$lcssa$i = $443;
              break L145;
             } else {
              $$032012$i = $441;$$032111$i = $443;
             }
            }
            HEAP32[$448>>2] = $319;
            $450 = ((($319)) + 24|0);
            HEAP32[$450>>2] = $$032111$i;
            $451 = ((($319)) + 12|0);
            HEAP32[$451>>2] = $319;
            $452 = ((($319)) + 8|0);
            HEAP32[$452>>2] = $319;
            break L128;
           }
          } while(0);
          $453 = ((($$0321$lcssa$i)) + 8|0);
          $454 = HEAP32[$453>>2]|0;
          $455 = ((($454)) + 12|0);
          HEAP32[$455>>2] = $319;
          HEAP32[$453>>2] = $319;
          $456 = ((($319)) + 8|0);
          HEAP32[$456>>2] = $454;
          $457 = ((($319)) + 12|0);
          HEAP32[$457>>2] = $$0321$lcssa$i;
          $458 = ((($319)) + 24|0);
          HEAP32[$458>>2] = 0;
         }
        } while(0);
        $459 = ((($$4$lcssa$i)) + 8|0);
        $$0 = $459;
        STACKTOP = sp;return ($$0|0);
       } else {
        $$0192 = $219;
       }
      } else {
       $$0192 = $219;
      }
     }
    }
   }
  }
 } while(0);
 $460 = HEAP32[(7764)>>2]|0;
 $461 = ($460>>>0)<($$0192>>>0);
 if (!($461)) {
  $462 = (($460) - ($$0192))|0;
  $463 = HEAP32[(7776)>>2]|0;
  $464 = ($462>>>0)>(15);
  if ($464) {
   $465 = (($463) + ($$0192)|0);
   HEAP32[(7776)>>2] = $465;
   HEAP32[(7764)>>2] = $462;
   $466 = $462 | 1;
   $467 = ((($465)) + 4|0);
   HEAP32[$467>>2] = $466;
   $468 = (($463) + ($460)|0);
   HEAP32[$468>>2] = $462;
   $469 = $$0192 | 3;
   $470 = ((($463)) + 4|0);
   HEAP32[$470>>2] = $469;
  } else {
   HEAP32[(7764)>>2] = 0;
   HEAP32[(7776)>>2] = 0;
   $471 = $460 | 3;
   $472 = ((($463)) + 4|0);
   HEAP32[$472>>2] = $471;
   $473 = (($463) + ($460)|0);
   $474 = ((($473)) + 4|0);
   $475 = HEAP32[$474>>2]|0;
   $476 = $475 | 1;
   HEAP32[$474>>2] = $476;
  }
  $477 = ((($463)) + 8|0);
  $$0 = $477;
  STACKTOP = sp;return ($$0|0);
 }
 $478 = HEAP32[(7768)>>2]|0;
 $479 = ($478>>>0)>($$0192>>>0);
 if ($479) {
  $480 = (($478) - ($$0192))|0;
  HEAP32[(7768)>>2] = $480;
  $481 = HEAP32[(7780)>>2]|0;
  $482 = (($481) + ($$0192)|0);
  HEAP32[(7780)>>2] = $482;
  $483 = $480 | 1;
  $484 = ((($482)) + 4|0);
  HEAP32[$484>>2] = $483;
  $485 = $$0192 | 3;
  $486 = ((($481)) + 4|0);
  HEAP32[$486>>2] = $485;
  $487 = ((($481)) + 8|0);
  $$0 = $487;
  STACKTOP = sp;return ($$0|0);
 }
 $488 = HEAP32[2057]|0;
 $489 = ($488|0)==(0);
 if ($489) {
  HEAP32[(8236)>>2] = 4096;
  HEAP32[(8232)>>2] = 4096;
  HEAP32[(8240)>>2] = -1;
  HEAP32[(8244)>>2] = -1;
  HEAP32[(8248)>>2] = 0;
  HEAP32[(8200)>>2] = 0;
  $490 = $1;
  $491 = $490 & -16;
  $492 = $491 ^ 1431655768;
  HEAP32[2057] = $492;
  $496 = 4096;
 } else {
  $$pre$i195 = HEAP32[(8236)>>2]|0;
  $496 = $$pre$i195;
 }
 $493 = (($$0192) + 48)|0;
 $494 = (($$0192) + 47)|0;
 $495 = (($496) + ($494))|0;
 $497 = (0 - ($496))|0;
 $498 = $495 & $497;
 $499 = ($498>>>0)>($$0192>>>0);
 if (!($499)) {
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $500 = HEAP32[(8196)>>2]|0;
 $501 = ($500|0)==(0);
 if (!($501)) {
  $502 = HEAP32[(8188)>>2]|0;
  $503 = (($502) + ($498))|0;
  $504 = ($503>>>0)<=($502>>>0);
  $505 = ($503>>>0)>($500>>>0);
  $or$cond1$i = $504 | $505;
  if ($or$cond1$i) {
   $$0 = 0;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $506 = HEAP32[(8200)>>2]|0;
 $507 = $506 & 4;
 $508 = ($507|0)==(0);
 L178: do {
  if ($508) {
   $509 = HEAP32[(7780)>>2]|0;
   $510 = ($509|0)==(0|0);
   L180: do {
    if ($510) {
     label = 128;
    } else {
     $$0$i20$i = (8204);
     while(1) {
      $511 = HEAP32[$$0$i20$i>>2]|0;
      $512 = ($511>>>0)>($509>>>0);
      if (!($512)) {
       $513 = ((($$0$i20$i)) + 4|0);
       $514 = HEAP32[$513>>2]|0;
       $515 = (($511) + ($514)|0);
       $516 = ($515>>>0)>($509>>>0);
       if ($516) {
        break;
       }
      }
      $517 = ((($$0$i20$i)) + 8|0);
      $518 = HEAP32[$517>>2]|0;
      $519 = ($518|0)==(0|0);
      if ($519) {
       label = 128;
       break L180;
      } else {
       $$0$i20$i = $518;
      }
     }
     $542 = (($495) - ($478))|0;
     $543 = $542 & $497;
     $544 = ($543>>>0)<(2147483647);
     if ($544) {
      $545 = ((($$0$i20$i)) + 4|0);
      $546 = (_sbrk(($543|0))|0);
      $547 = HEAP32[$$0$i20$i>>2]|0;
      $548 = HEAP32[$545>>2]|0;
      $549 = (($547) + ($548)|0);
      $550 = ($546|0)==($549|0);
      if ($550) {
       $551 = ($546|0)==((-1)|0);
       if ($551) {
        $$2234243136$i = $543;
       } else {
        $$723947$i = $543;$$748$i = $546;
        label = 145;
        break L178;
       }
      } else {
       $$2247$ph$i = $546;$$2253$ph$i = $543;
       label = 136;
      }
     } else {
      $$2234243136$i = 0;
     }
    }
   } while(0);
   do {
    if ((label|0) == 128) {
     $520 = (_sbrk(0)|0);
     $521 = ($520|0)==((-1)|0);
     if ($521) {
      $$2234243136$i = 0;
     } else {
      $522 = $520;
      $523 = HEAP32[(8232)>>2]|0;
      $524 = (($523) + -1)|0;
      $525 = $524 & $522;
      $526 = ($525|0)==(0);
      $527 = (($524) + ($522))|0;
      $528 = (0 - ($523))|0;
      $529 = $527 & $528;
      $530 = (($529) - ($522))|0;
      $531 = $526 ? 0 : $530;
      $spec$select49$i = (($531) + ($498))|0;
      $532 = HEAP32[(8188)>>2]|0;
      $533 = (($spec$select49$i) + ($532))|0;
      $534 = ($spec$select49$i>>>0)>($$0192>>>0);
      $535 = ($spec$select49$i>>>0)<(2147483647);
      $or$cond$i = $534 & $535;
      if ($or$cond$i) {
       $536 = HEAP32[(8196)>>2]|0;
       $537 = ($536|0)==(0);
       if (!($537)) {
        $538 = ($533>>>0)<=($532>>>0);
        $539 = ($533>>>0)>($536>>>0);
        $or$cond2$i = $538 | $539;
        if ($or$cond2$i) {
         $$2234243136$i = 0;
         break;
        }
       }
       $540 = (_sbrk(($spec$select49$i|0))|0);
       $541 = ($540|0)==($520|0);
       if ($541) {
        $$723947$i = $spec$select49$i;$$748$i = $520;
        label = 145;
        break L178;
       } else {
        $$2247$ph$i = $540;$$2253$ph$i = $spec$select49$i;
        label = 136;
       }
      } else {
       $$2234243136$i = 0;
      }
     }
    }
   } while(0);
   do {
    if ((label|0) == 136) {
     $552 = (0 - ($$2253$ph$i))|0;
     $553 = ($$2247$ph$i|0)!=((-1)|0);
     $554 = ($$2253$ph$i>>>0)<(2147483647);
     $or$cond7$i = $554 & $553;
     $555 = ($493>>>0)>($$2253$ph$i>>>0);
     $or$cond6$i = $555 & $or$cond7$i;
     if (!($or$cond6$i)) {
      $565 = ($$2247$ph$i|0)==((-1)|0);
      if ($565) {
       $$2234243136$i = 0;
       break;
      } else {
       $$723947$i = $$2253$ph$i;$$748$i = $$2247$ph$i;
       label = 145;
       break L178;
      }
     }
     $556 = HEAP32[(8236)>>2]|0;
     $557 = (($494) - ($$2253$ph$i))|0;
     $558 = (($557) + ($556))|0;
     $559 = (0 - ($556))|0;
     $560 = $558 & $559;
     $561 = ($560>>>0)<(2147483647);
     if (!($561)) {
      $$723947$i = $$2253$ph$i;$$748$i = $$2247$ph$i;
      label = 145;
      break L178;
     }
     $562 = (_sbrk(($560|0))|0);
     $563 = ($562|0)==((-1)|0);
     if ($563) {
      (_sbrk(($552|0))|0);
      $$2234243136$i = 0;
      break;
     } else {
      $564 = (($560) + ($$2253$ph$i))|0;
      $$723947$i = $564;$$748$i = $$2247$ph$i;
      label = 145;
      break L178;
     }
    }
   } while(0);
   $566 = HEAP32[(8200)>>2]|0;
   $567 = $566 | 4;
   HEAP32[(8200)>>2] = $567;
   $$4236$i = $$2234243136$i;
   label = 143;
  } else {
   $$4236$i = 0;
   label = 143;
  }
 } while(0);
 if ((label|0) == 143) {
  $568 = ($498>>>0)<(2147483647);
  if ($568) {
   $569 = (_sbrk(($498|0))|0);
   $570 = (_sbrk(0)|0);
   $571 = ($569|0)!=((-1)|0);
   $572 = ($570|0)!=((-1)|0);
   $or$cond5$i = $571 & $572;
   $573 = ($569>>>0)<($570>>>0);
   $or$cond8$i = $573 & $or$cond5$i;
   $574 = $570;
   $575 = $569;
   $576 = (($574) - ($575))|0;
   $577 = (($$0192) + 40)|0;
   $578 = ($576>>>0)>($577>>>0);
   $spec$select9$i = $578 ? $576 : $$4236$i;
   $or$cond8$not$i = $or$cond8$i ^ 1;
   $579 = ($569|0)==((-1)|0);
   $not$$i = $578 ^ 1;
   $580 = $579 | $not$$i;
   $or$cond50$i = $580 | $or$cond8$not$i;
   if (!($or$cond50$i)) {
    $$723947$i = $spec$select9$i;$$748$i = $569;
    label = 145;
   }
  }
 }
 if ((label|0) == 145) {
  $581 = HEAP32[(8188)>>2]|0;
  $582 = (($581) + ($$723947$i))|0;
  HEAP32[(8188)>>2] = $582;
  $583 = HEAP32[(8192)>>2]|0;
  $584 = ($582>>>0)>($583>>>0);
  if ($584) {
   HEAP32[(8192)>>2] = $582;
  }
  $585 = HEAP32[(7780)>>2]|0;
  $586 = ($585|0)==(0|0);
  L215: do {
   if ($586) {
    $587 = HEAP32[(7772)>>2]|0;
    $588 = ($587|0)==(0|0);
    $589 = ($$748$i>>>0)<($587>>>0);
    $or$cond11$i = $588 | $589;
    if ($or$cond11$i) {
     HEAP32[(7772)>>2] = $$748$i;
    }
    HEAP32[(8204)>>2] = $$748$i;
    HEAP32[(8208)>>2] = $$723947$i;
    HEAP32[(8216)>>2] = 0;
    $590 = HEAP32[2057]|0;
    HEAP32[(7792)>>2] = $590;
    HEAP32[(7788)>>2] = -1;
    HEAP32[(7808)>>2] = (7796);
    HEAP32[(7804)>>2] = (7796);
    HEAP32[(7816)>>2] = (7804);
    HEAP32[(7812)>>2] = (7804);
    HEAP32[(7824)>>2] = (7812);
    HEAP32[(7820)>>2] = (7812);
    HEAP32[(7832)>>2] = (7820);
    HEAP32[(7828)>>2] = (7820);
    HEAP32[(7840)>>2] = (7828);
    HEAP32[(7836)>>2] = (7828);
    HEAP32[(7848)>>2] = (7836);
    HEAP32[(7844)>>2] = (7836);
    HEAP32[(7856)>>2] = (7844);
    HEAP32[(7852)>>2] = (7844);
    HEAP32[(7864)>>2] = (7852);
    HEAP32[(7860)>>2] = (7852);
    HEAP32[(7872)>>2] = (7860);
    HEAP32[(7868)>>2] = (7860);
    HEAP32[(7880)>>2] = (7868);
    HEAP32[(7876)>>2] = (7868);
    HEAP32[(7888)>>2] = (7876);
    HEAP32[(7884)>>2] = (7876);
    HEAP32[(7896)>>2] = (7884);
    HEAP32[(7892)>>2] = (7884);
    HEAP32[(7904)>>2] = (7892);
    HEAP32[(7900)>>2] = (7892);
    HEAP32[(7912)>>2] = (7900);
    HEAP32[(7908)>>2] = (7900);
    HEAP32[(7920)>>2] = (7908);
    HEAP32[(7916)>>2] = (7908);
    HEAP32[(7928)>>2] = (7916);
    HEAP32[(7924)>>2] = (7916);
    HEAP32[(7936)>>2] = (7924);
    HEAP32[(7932)>>2] = (7924);
    HEAP32[(7944)>>2] = (7932);
    HEAP32[(7940)>>2] = (7932);
    HEAP32[(7952)>>2] = (7940);
    HEAP32[(7948)>>2] = (7940);
    HEAP32[(7960)>>2] = (7948);
    HEAP32[(7956)>>2] = (7948);
    HEAP32[(7968)>>2] = (7956);
    HEAP32[(7964)>>2] = (7956);
    HEAP32[(7976)>>2] = (7964);
    HEAP32[(7972)>>2] = (7964);
    HEAP32[(7984)>>2] = (7972);
    HEAP32[(7980)>>2] = (7972);
    HEAP32[(7992)>>2] = (7980);
    HEAP32[(7988)>>2] = (7980);
    HEAP32[(8000)>>2] = (7988);
    HEAP32[(7996)>>2] = (7988);
    HEAP32[(8008)>>2] = (7996);
    HEAP32[(8004)>>2] = (7996);
    HEAP32[(8016)>>2] = (8004);
    HEAP32[(8012)>>2] = (8004);
    HEAP32[(8024)>>2] = (8012);
    HEAP32[(8020)>>2] = (8012);
    HEAP32[(8032)>>2] = (8020);
    HEAP32[(8028)>>2] = (8020);
    HEAP32[(8040)>>2] = (8028);
    HEAP32[(8036)>>2] = (8028);
    HEAP32[(8048)>>2] = (8036);
    HEAP32[(8044)>>2] = (8036);
    HEAP32[(8056)>>2] = (8044);
    HEAP32[(8052)>>2] = (8044);
    $591 = (($$723947$i) + -40)|0;
    $592 = ((($$748$i)) + 8|0);
    $593 = $592;
    $594 = $593 & 7;
    $595 = ($594|0)==(0);
    $596 = (0 - ($593))|0;
    $597 = $596 & 7;
    $598 = $595 ? 0 : $597;
    $599 = (($$748$i) + ($598)|0);
    $600 = (($591) - ($598))|0;
    HEAP32[(7780)>>2] = $599;
    HEAP32[(7768)>>2] = $600;
    $601 = $600 | 1;
    $602 = ((($599)) + 4|0);
    HEAP32[$602>>2] = $601;
    $603 = (($$748$i) + ($591)|0);
    $604 = ((($603)) + 4|0);
    HEAP32[$604>>2] = 40;
    $605 = HEAP32[(8244)>>2]|0;
    HEAP32[(7784)>>2] = $605;
   } else {
    $$024372$i = (8204);
    while(1) {
     $606 = HEAP32[$$024372$i>>2]|0;
     $607 = ((($$024372$i)) + 4|0);
     $608 = HEAP32[$607>>2]|0;
     $609 = (($606) + ($608)|0);
     $610 = ($$748$i|0)==($609|0);
     if ($610) {
      label = 154;
      break;
     }
     $611 = ((($$024372$i)) + 8|0);
     $612 = HEAP32[$611>>2]|0;
     $613 = ($612|0)==(0|0);
     if ($613) {
      break;
     } else {
      $$024372$i = $612;
     }
    }
    if ((label|0) == 154) {
     $614 = ((($$024372$i)) + 4|0);
     $615 = ((($$024372$i)) + 12|0);
     $616 = HEAP32[$615>>2]|0;
     $617 = $616 & 8;
     $618 = ($617|0)==(0);
     if ($618) {
      $619 = ($606>>>0)<=($585>>>0);
      $620 = ($$748$i>>>0)>($585>>>0);
      $or$cond51$i = $620 & $619;
      if ($or$cond51$i) {
       $621 = (($608) + ($$723947$i))|0;
       HEAP32[$614>>2] = $621;
       $622 = HEAP32[(7768)>>2]|0;
       $623 = (($622) + ($$723947$i))|0;
       $624 = ((($585)) + 8|0);
       $625 = $624;
       $626 = $625 & 7;
       $627 = ($626|0)==(0);
       $628 = (0 - ($625))|0;
       $629 = $628 & 7;
       $630 = $627 ? 0 : $629;
       $631 = (($585) + ($630)|0);
       $632 = (($623) - ($630))|0;
       HEAP32[(7780)>>2] = $631;
       HEAP32[(7768)>>2] = $632;
       $633 = $632 | 1;
       $634 = ((($631)) + 4|0);
       HEAP32[$634>>2] = $633;
       $635 = (($585) + ($623)|0);
       $636 = ((($635)) + 4|0);
       HEAP32[$636>>2] = 40;
       $637 = HEAP32[(8244)>>2]|0;
       HEAP32[(7784)>>2] = $637;
       break;
      }
     }
    }
    $638 = HEAP32[(7772)>>2]|0;
    $639 = ($$748$i>>>0)<($638>>>0);
    if ($639) {
     HEAP32[(7772)>>2] = $$748$i;
    }
    $640 = (($$748$i) + ($$723947$i)|0);
    $$124471$i = (8204);
    while(1) {
     $641 = HEAP32[$$124471$i>>2]|0;
     $642 = ($641|0)==($640|0);
     if ($642) {
      label = 162;
      break;
     }
     $643 = ((($$124471$i)) + 8|0);
     $644 = HEAP32[$643>>2]|0;
     $645 = ($644|0)==(0|0);
     if ($645) {
      break;
     } else {
      $$124471$i = $644;
     }
    }
    if ((label|0) == 162) {
     $646 = ((($$124471$i)) + 12|0);
     $647 = HEAP32[$646>>2]|0;
     $648 = $647 & 8;
     $649 = ($648|0)==(0);
     if ($649) {
      HEAP32[$$124471$i>>2] = $$748$i;
      $650 = ((($$124471$i)) + 4|0);
      $651 = HEAP32[$650>>2]|0;
      $652 = (($651) + ($$723947$i))|0;
      HEAP32[$650>>2] = $652;
      $653 = ((($$748$i)) + 8|0);
      $654 = $653;
      $655 = $654 & 7;
      $656 = ($655|0)==(0);
      $657 = (0 - ($654))|0;
      $658 = $657 & 7;
      $659 = $656 ? 0 : $658;
      $660 = (($$748$i) + ($659)|0);
      $661 = ((($640)) + 8|0);
      $662 = $661;
      $663 = $662 & 7;
      $664 = ($663|0)==(0);
      $665 = (0 - ($662))|0;
      $666 = $665 & 7;
      $667 = $664 ? 0 : $666;
      $668 = (($640) + ($667)|0);
      $669 = $668;
      $670 = $660;
      $671 = (($669) - ($670))|0;
      $672 = (($660) + ($$0192)|0);
      $673 = (($671) - ($$0192))|0;
      $674 = $$0192 | 3;
      $675 = ((($660)) + 4|0);
      HEAP32[$675>>2] = $674;
      $676 = ($585|0)==($668|0);
      L238: do {
       if ($676) {
        $677 = HEAP32[(7768)>>2]|0;
        $678 = (($677) + ($673))|0;
        HEAP32[(7768)>>2] = $678;
        HEAP32[(7780)>>2] = $672;
        $679 = $678 | 1;
        $680 = ((($672)) + 4|0);
        HEAP32[$680>>2] = $679;
       } else {
        $681 = HEAP32[(7776)>>2]|0;
        $682 = ($681|0)==($668|0);
        if ($682) {
         $683 = HEAP32[(7764)>>2]|0;
         $684 = (($683) + ($673))|0;
         HEAP32[(7764)>>2] = $684;
         HEAP32[(7776)>>2] = $672;
         $685 = $684 | 1;
         $686 = ((($672)) + 4|0);
         HEAP32[$686>>2] = $685;
         $687 = (($672) + ($684)|0);
         HEAP32[$687>>2] = $684;
         break;
        }
        $688 = ((($668)) + 4|0);
        $689 = HEAP32[$688>>2]|0;
        $690 = $689 & 3;
        $691 = ($690|0)==(1);
        if ($691) {
         $692 = $689 & -8;
         $693 = $689 >>> 3;
         $694 = ($689>>>0)<(256);
         L246: do {
          if ($694) {
           $695 = ((($668)) + 8|0);
           $696 = HEAP32[$695>>2]|0;
           $697 = ((($668)) + 12|0);
           $698 = HEAP32[$697>>2]|0;
           $699 = ($698|0)==($696|0);
           if ($699) {
            $700 = 1 << $693;
            $701 = $700 ^ -1;
            $702 = HEAP32[1939]|0;
            $703 = $702 & $701;
            HEAP32[1939] = $703;
            break;
           } else {
            $704 = ((($696)) + 12|0);
            HEAP32[$704>>2] = $698;
            $705 = ((($698)) + 8|0);
            HEAP32[$705>>2] = $696;
            break;
           }
          } else {
           $706 = ((($668)) + 24|0);
           $707 = HEAP32[$706>>2]|0;
           $708 = ((($668)) + 12|0);
           $709 = HEAP32[$708>>2]|0;
           $710 = ($709|0)==($668|0);
           do {
            if ($710) {
             $715 = ((($668)) + 16|0);
             $716 = ((($715)) + 4|0);
             $717 = HEAP32[$716>>2]|0;
             $718 = ($717|0)==(0|0);
             if ($718) {
              $719 = HEAP32[$715>>2]|0;
              $720 = ($719|0)==(0|0);
              if ($720) {
               $$3$i$i = 0;
               break;
              } else {
               $$1263$i$i$ph = $719;$$1265$i$i$ph = $715;
              }
             } else {
              $$1263$i$i$ph = $717;$$1265$i$i$ph = $716;
             }
             $$1263$i$i = $$1263$i$i$ph;$$1265$i$i = $$1265$i$i$ph;
             while(1) {
              $721 = ((($$1263$i$i)) + 20|0);
              $722 = HEAP32[$721>>2]|0;
              $723 = ($722|0)==(0|0);
              if ($723) {
               $724 = ((($$1263$i$i)) + 16|0);
               $725 = HEAP32[$724>>2]|0;
               $726 = ($725|0)==(0|0);
               if ($726) {
                break;
               } else {
                $$1263$i$i$be = $725;$$1265$i$i$be = $724;
               }
              } else {
               $$1263$i$i$be = $722;$$1265$i$i$be = $721;
              }
              $$1263$i$i = $$1263$i$i$be;$$1265$i$i = $$1265$i$i$be;
             }
             HEAP32[$$1265$i$i>>2] = 0;
             $$3$i$i = $$1263$i$i;
            } else {
             $711 = ((($668)) + 8|0);
             $712 = HEAP32[$711>>2]|0;
             $713 = ((($712)) + 12|0);
             HEAP32[$713>>2] = $709;
             $714 = ((($709)) + 8|0);
             HEAP32[$714>>2] = $712;
             $$3$i$i = $709;
            }
           } while(0);
           $727 = ($707|0)==(0|0);
           if ($727) {
            break;
           }
           $728 = ((($668)) + 28|0);
           $729 = HEAP32[$728>>2]|0;
           $730 = (8060 + ($729<<2)|0);
           $731 = HEAP32[$730>>2]|0;
           $732 = ($731|0)==($668|0);
           do {
            if ($732) {
             HEAP32[$730>>2] = $$3$i$i;
             $cond$i$i = ($$3$i$i|0)==(0|0);
             if (!($cond$i$i)) {
              break;
             }
             $733 = 1 << $729;
             $734 = $733 ^ -1;
             $735 = HEAP32[(7760)>>2]|0;
             $736 = $735 & $734;
             HEAP32[(7760)>>2] = $736;
             break L246;
            } else {
             $737 = ((($707)) + 16|0);
             $738 = HEAP32[$737>>2]|0;
             $739 = ($738|0)==($668|0);
             $740 = ((($707)) + 20|0);
             $$sink321 = $739 ? $737 : $740;
             HEAP32[$$sink321>>2] = $$3$i$i;
             $741 = ($$3$i$i|0)==(0|0);
             if ($741) {
              break L246;
             }
            }
           } while(0);
           $742 = ((($$3$i$i)) + 24|0);
           HEAP32[$742>>2] = $707;
           $743 = ((($668)) + 16|0);
           $744 = HEAP32[$743>>2]|0;
           $745 = ($744|0)==(0|0);
           if (!($745)) {
            $746 = ((($$3$i$i)) + 16|0);
            HEAP32[$746>>2] = $744;
            $747 = ((($744)) + 24|0);
            HEAP32[$747>>2] = $$3$i$i;
           }
           $748 = ((($743)) + 4|0);
           $749 = HEAP32[$748>>2]|0;
           $750 = ($749|0)==(0|0);
           if ($750) {
            break;
           }
           $751 = ((($$3$i$i)) + 20|0);
           HEAP32[$751>>2] = $749;
           $752 = ((($749)) + 24|0);
           HEAP32[$752>>2] = $$3$i$i;
          }
         } while(0);
         $753 = (($668) + ($692)|0);
         $754 = (($692) + ($673))|0;
         $$0$i$i = $753;$$0259$i$i = $754;
        } else {
         $$0$i$i = $668;$$0259$i$i = $673;
        }
        $755 = ((($$0$i$i)) + 4|0);
        $756 = HEAP32[$755>>2]|0;
        $757 = $756 & -2;
        HEAP32[$755>>2] = $757;
        $758 = $$0259$i$i | 1;
        $759 = ((($672)) + 4|0);
        HEAP32[$759>>2] = $758;
        $760 = (($672) + ($$0259$i$i)|0);
        HEAP32[$760>>2] = $$0259$i$i;
        $761 = $$0259$i$i >>> 3;
        $762 = ($$0259$i$i>>>0)<(256);
        if ($762) {
         $763 = $761 << 1;
         $764 = (7796 + ($763<<2)|0);
         $765 = HEAP32[1939]|0;
         $766 = 1 << $761;
         $767 = $765 & $766;
         $768 = ($767|0)==(0);
         if ($768) {
          $769 = $765 | $766;
          HEAP32[1939] = $769;
          $$pre$i16$i = ((($764)) + 8|0);
          $$0267$i$i = $764;$$pre$phi$i17$iZ2D = $$pre$i16$i;
         } else {
          $770 = ((($764)) + 8|0);
          $771 = HEAP32[$770>>2]|0;
          $$0267$i$i = $771;$$pre$phi$i17$iZ2D = $770;
         }
         HEAP32[$$pre$phi$i17$iZ2D>>2] = $672;
         $772 = ((($$0267$i$i)) + 12|0);
         HEAP32[$772>>2] = $672;
         $773 = ((($672)) + 8|0);
         HEAP32[$773>>2] = $$0267$i$i;
         $774 = ((($672)) + 12|0);
         HEAP32[$774>>2] = $764;
         break;
        }
        $775 = $$0259$i$i >>> 8;
        $776 = ($775|0)==(0);
        do {
         if ($776) {
          $$0268$i$i = 0;
         } else {
          $777 = ($$0259$i$i>>>0)>(16777215);
          if ($777) {
           $$0268$i$i = 31;
           break;
          }
          $778 = (($775) + 1048320)|0;
          $779 = $778 >>> 16;
          $780 = $779 & 8;
          $781 = $775 << $780;
          $782 = (($781) + 520192)|0;
          $783 = $782 >>> 16;
          $784 = $783 & 4;
          $785 = $784 | $780;
          $786 = $781 << $784;
          $787 = (($786) + 245760)|0;
          $788 = $787 >>> 16;
          $789 = $788 & 2;
          $790 = $785 | $789;
          $791 = (14 - ($790))|0;
          $792 = $786 << $789;
          $793 = $792 >>> 15;
          $794 = (($791) + ($793))|0;
          $795 = $794 << 1;
          $796 = (($794) + 7)|0;
          $797 = $$0259$i$i >>> $796;
          $798 = $797 & 1;
          $799 = $798 | $795;
          $$0268$i$i = $799;
         }
        } while(0);
        $800 = (8060 + ($$0268$i$i<<2)|0);
        $801 = ((($672)) + 28|0);
        HEAP32[$801>>2] = $$0268$i$i;
        $802 = ((($672)) + 16|0);
        $803 = ((($802)) + 4|0);
        HEAP32[$803>>2] = 0;
        HEAP32[$802>>2] = 0;
        $804 = HEAP32[(7760)>>2]|0;
        $805 = 1 << $$0268$i$i;
        $806 = $804 & $805;
        $807 = ($806|0)==(0);
        if ($807) {
         $808 = $804 | $805;
         HEAP32[(7760)>>2] = $808;
         HEAP32[$800>>2] = $672;
         $809 = ((($672)) + 24|0);
         HEAP32[$809>>2] = $800;
         $810 = ((($672)) + 12|0);
         HEAP32[$810>>2] = $672;
         $811 = ((($672)) + 8|0);
         HEAP32[$811>>2] = $672;
         break;
        }
        $812 = HEAP32[$800>>2]|0;
        $813 = ((($812)) + 4|0);
        $814 = HEAP32[$813>>2]|0;
        $815 = $814 & -8;
        $816 = ($815|0)==($$0259$i$i|0);
        L291: do {
         if ($816) {
          $$0261$lcssa$i$i = $812;
         } else {
          $817 = ($$0268$i$i|0)==(31);
          $818 = $$0268$i$i >>> 1;
          $819 = (25 - ($818))|0;
          $820 = $817 ? 0 : $819;
          $821 = $$0259$i$i << $820;
          $$02604$i$i = $821;$$02613$i$i = $812;
          while(1) {
           $828 = $$02604$i$i >>> 31;
           $829 = (((($$02613$i$i)) + 16|0) + ($828<<2)|0);
           $824 = HEAP32[$829>>2]|0;
           $830 = ($824|0)==(0|0);
           if ($830) {
            break;
           }
           $822 = $$02604$i$i << 1;
           $823 = ((($824)) + 4|0);
           $825 = HEAP32[$823>>2]|0;
           $826 = $825 & -8;
           $827 = ($826|0)==($$0259$i$i|0);
           if ($827) {
            $$0261$lcssa$i$i = $824;
            break L291;
           } else {
            $$02604$i$i = $822;$$02613$i$i = $824;
           }
          }
          HEAP32[$829>>2] = $672;
          $831 = ((($672)) + 24|0);
          HEAP32[$831>>2] = $$02613$i$i;
          $832 = ((($672)) + 12|0);
          HEAP32[$832>>2] = $672;
          $833 = ((($672)) + 8|0);
          HEAP32[$833>>2] = $672;
          break L238;
         }
        } while(0);
        $834 = ((($$0261$lcssa$i$i)) + 8|0);
        $835 = HEAP32[$834>>2]|0;
        $836 = ((($835)) + 12|0);
        HEAP32[$836>>2] = $672;
        HEAP32[$834>>2] = $672;
        $837 = ((($672)) + 8|0);
        HEAP32[$837>>2] = $835;
        $838 = ((($672)) + 12|0);
        HEAP32[$838>>2] = $$0261$lcssa$i$i;
        $839 = ((($672)) + 24|0);
        HEAP32[$839>>2] = 0;
       }
      } while(0);
      $968 = ((($660)) + 8|0);
      $$0 = $968;
      STACKTOP = sp;return ($$0|0);
     }
    }
    $$0$i$i$i = (8204);
    while(1) {
     $840 = HEAP32[$$0$i$i$i>>2]|0;
     $841 = ($840>>>0)>($585>>>0);
     if (!($841)) {
      $842 = ((($$0$i$i$i)) + 4|0);
      $843 = HEAP32[$842>>2]|0;
      $844 = (($840) + ($843)|0);
      $845 = ($844>>>0)>($585>>>0);
      if ($845) {
       break;
      }
     }
     $846 = ((($$0$i$i$i)) + 8|0);
     $847 = HEAP32[$846>>2]|0;
     $$0$i$i$i = $847;
    }
    $848 = ((($844)) + -47|0);
    $849 = ((($848)) + 8|0);
    $850 = $849;
    $851 = $850 & 7;
    $852 = ($851|0)==(0);
    $853 = (0 - ($850))|0;
    $854 = $853 & 7;
    $855 = $852 ? 0 : $854;
    $856 = (($848) + ($855)|0);
    $857 = ((($585)) + 16|0);
    $858 = ($856>>>0)<($857>>>0);
    $859 = $858 ? $585 : $856;
    $860 = ((($859)) + 8|0);
    $861 = ((($859)) + 24|0);
    $862 = (($$723947$i) + -40)|0;
    $863 = ((($$748$i)) + 8|0);
    $864 = $863;
    $865 = $864 & 7;
    $866 = ($865|0)==(0);
    $867 = (0 - ($864))|0;
    $868 = $867 & 7;
    $869 = $866 ? 0 : $868;
    $870 = (($$748$i) + ($869)|0);
    $871 = (($862) - ($869))|0;
    HEAP32[(7780)>>2] = $870;
    HEAP32[(7768)>>2] = $871;
    $872 = $871 | 1;
    $873 = ((($870)) + 4|0);
    HEAP32[$873>>2] = $872;
    $874 = (($$748$i) + ($862)|0);
    $875 = ((($874)) + 4|0);
    HEAP32[$875>>2] = 40;
    $876 = HEAP32[(8244)>>2]|0;
    HEAP32[(7784)>>2] = $876;
    $877 = ((($859)) + 4|0);
    HEAP32[$877>>2] = 27;
    ;HEAP32[$860>>2]=HEAP32[(8204)>>2]|0;HEAP32[$860+4>>2]=HEAP32[(8204)+4>>2]|0;HEAP32[$860+8>>2]=HEAP32[(8204)+8>>2]|0;HEAP32[$860+12>>2]=HEAP32[(8204)+12>>2]|0;
    HEAP32[(8204)>>2] = $$748$i;
    HEAP32[(8208)>>2] = $$723947$i;
    HEAP32[(8216)>>2] = 0;
    HEAP32[(8212)>>2] = $860;
    $879 = $861;
    while(1) {
     $878 = ((($879)) + 4|0);
     HEAP32[$878>>2] = 7;
     $880 = ((($879)) + 8|0);
     $881 = ($880>>>0)<($844>>>0);
     if ($881) {
      $879 = $878;
     } else {
      break;
     }
    }
    $882 = ($859|0)==($585|0);
    if (!($882)) {
     $883 = $859;
     $884 = $585;
     $885 = (($883) - ($884))|0;
     $886 = HEAP32[$877>>2]|0;
     $887 = $886 & -2;
     HEAP32[$877>>2] = $887;
     $888 = $885 | 1;
     $889 = ((($585)) + 4|0);
     HEAP32[$889>>2] = $888;
     HEAP32[$859>>2] = $885;
     $890 = $885 >>> 3;
     $891 = ($885>>>0)<(256);
     if ($891) {
      $892 = $890 << 1;
      $893 = (7796 + ($892<<2)|0);
      $894 = HEAP32[1939]|0;
      $895 = 1 << $890;
      $896 = $894 & $895;
      $897 = ($896|0)==(0);
      if ($897) {
       $898 = $894 | $895;
       HEAP32[1939] = $898;
       $$pre$i$i = ((($893)) + 8|0);
       $$0206$i$i = $893;$$pre$phi$i$iZ2D = $$pre$i$i;
      } else {
       $899 = ((($893)) + 8|0);
       $900 = HEAP32[$899>>2]|0;
       $$0206$i$i = $900;$$pre$phi$i$iZ2D = $899;
      }
      HEAP32[$$pre$phi$i$iZ2D>>2] = $585;
      $901 = ((($$0206$i$i)) + 12|0);
      HEAP32[$901>>2] = $585;
      $902 = ((($585)) + 8|0);
      HEAP32[$902>>2] = $$0206$i$i;
      $903 = ((($585)) + 12|0);
      HEAP32[$903>>2] = $893;
      break;
     }
     $904 = $885 >>> 8;
     $905 = ($904|0)==(0);
     if ($905) {
      $$0207$i$i = 0;
     } else {
      $906 = ($885>>>0)>(16777215);
      if ($906) {
       $$0207$i$i = 31;
      } else {
       $907 = (($904) + 1048320)|0;
       $908 = $907 >>> 16;
       $909 = $908 & 8;
       $910 = $904 << $909;
       $911 = (($910) + 520192)|0;
       $912 = $911 >>> 16;
       $913 = $912 & 4;
       $914 = $913 | $909;
       $915 = $910 << $913;
       $916 = (($915) + 245760)|0;
       $917 = $916 >>> 16;
       $918 = $917 & 2;
       $919 = $914 | $918;
       $920 = (14 - ($919))|0;
       $921 = $915 << $918;
       $922 = $921 >>> 15;
       $923 = (($920) + ($922))|0;
       $924 = $923 << 1;
       $925 = (($923) + 7)|0;
       $926 = $885 >>> $925;
       $927 = $926 & 1;
       $928 = $927 | $924;
       $$0207$i$i = $928;
      }
     }
     $929 = (8060 + ($$0207$i$i<<2)|0);
     $930 = ((($585)) + 28|0);
     HEAP32[$930>>2] = $$0207$i$i;
     $931 = ((($585)) + 20|0);
     HEAP32[$931>>2] = 0;
     HEAP32[$857>>2] = 0;
     $932 = HEAP32[(7760)>>2]|0;
     $933 = 1 << $$0207$i$i;
     $934 = $932 & $933;
     $935 = ($934|0)==(0);
     if ($935) {
      $936 = $932 | $933;
      HEAP32[(7760)>>2] = $936;
      HEAP32[$929>>2] = $585;
      $937 = ((($585)) + 24|0);
      HEAP32[$937>>2] = $929;
      $938 = ((($585)) + 12|0);
      HEAP32[$938>>2] = $585;
      $939 = ((($585)) + 8|0);
      HEAP32[$939>>2] = $585;
      break;
     }
     $940 = HEAP32[$929>>2]|0;
     $941 = ((($940)) + 4|0);
     $942 = HEAP32[$941>>2]|0;
     $943 = $942 & -8;
     $944 = ($943|0)==($885|0);
     L325: do {
      if ($944) {
       $$0202$lcssa$i$i = $940;
      } else {
       $945 = ($$0207$i$i|0)==(31);
       $946 = $$0207$i$i >>> 1;
       $947 = (25 - ($946))|0;
       $948 = $945 ? 0 : $947;
       $949 = $885 << $948;
       $$02014$i$i = $949;$$02023$i$i = $940;
       while(1) {
        $956 = $$02014$i$i >>> 31;
        $957 = (((($$02023$i$i)) + 16|0) + ($956<<2)|0);
        $952 = HEAP32[$957>>2]|0;
        $958 = ($952|0)==(0|0);
        if ($958) {
         break;
        }
        $950 = $$02014$i$i << 1;
        $951 = ((($952)) + 4|0);
        $953 = HEAP32[$951>>2]|0;
        $954 = $953 & -8;
        $955 = ($954|0)==($885|0);
        if ($955) {
         $$0202$lcssa$i$i = $952;
         break L325;
        } else {
         $$02014$i$i = $950;$$02023$i$i = $952;
        }
       }
       HEAP32[$957>>2] = $585;
       $959 = ((($585)) + 24|0);
       HEAP32[$959>>2] = $$02023$i$i;
       $960 = ((($585)) + 12|0);
       HEAP32[$960>>2] = $585;
       $961 = ((($585)) + 8|0);
       HEAP32[$961>>2] = $585;
       break L215;
      }
     } while(0);
     $962 = ((($$0202$lcssa$i$i)) + 8|0);
     $963 = HEAP32[$962>>2]|0;
     $964 = ((($963)) + 12|0);
     HEAP32[$964>>2] = $585;
     HEAP32[$962>>2] = $585;
     $965 = ((($585)) + 8|0);
     HEAP32[$965>>2] = $963;
     $966 = ((($585)) + 12|0);
     HEAP32[$966>>2] = $$0202$lcssa$i$i;
     $967 = ((($585)) + 24|0);
     HEAP32[$967>>2] = 0;
    }
   }
  } while(0);
  $969 = HEAP32[(7768)>>2]|0;
  $970 = ($969>>>0)>($$0192>>>0);
  if ($970) {
   $971 = (($969) - ($$0192))|0;
   HEAP32[(7768)>>2] = $971;
   $972 = HEAP32[(7780)>>2]|0;
   $973 = (($972) + ($$0192)|0);
   HEAP32[(7780)>>2] = $973;
   $974 = $971 | 1;
   $975 = ((($973)) + 4|0);
   HEAP32[$975>>2] = $974;
   $976 = $$0192 | 3;
   $977 = ((($972)) + 4|0);
   HEAP32[$977>>2] = $976;
   $978 = ((($972)) + 8|0);
   $$0 = $978;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $979 = (___errno_location()|0);
 HEAP32[$979>>2] = 12;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function _free($0) {
 $0 = $0|0;
 var $$0194$i = 0, $$0194$in$i = 0, $$0346381 = 0, $$0347$lcssa = 0, $$0347380 = 0, $$0359 = 0, $$0366 = 0, $$1 = 0, $$1345 = 0, $$1350 = 0, $$1350$be = 0, $$1350$ph = 0, $$1353 = 0, $$1353$be = 0, $$1353$ph = 0, $$1361 = 0, $$1361$be = 0, $$1361$ph = 0, $$1365 = 0, $$1365$be = 0;
 var $$1365$ph = 0, $$2 = 0, $$3 = 0, $$3363 = 0, $$pre = 0, $$pre$phiZ2D = 0, $$sink = 0, $$sink395 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0;
 var $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0;
 var $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0;
 var $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0;
 var $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0;
 var $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0;
 var $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0;
 var $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0;
 var $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0;
 var $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0;
 var $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0;
 var $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0;
 var $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0;
 var $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $cond371 = 0, $cond372 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0|0);
 if ($1) {
  return;
 }
 $2 = ((($0)) + -8|0);
 $3 = HEAP32[(7772)>>2]|0;
 $4 = ((($0)) + -4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $5 & -8;
 $7 = (($2) + ($6)|0);
 $8 = $5 & 1;
 $9 = ($8|0)==(0);
 do {
  if ($9) {
   $10 = HEAP32[$2>>2]|0;
   $11 = $5 & 3;
   $12 = ($11|0)==(0);
   if ($12) {
    return;
   }
   $13 = (0 - ($10))|0;
   $14 = (($2) + ($13)|0);
   $15 = (($10) + ($6))|0;
   $16 = ($14>>>0)<($3>>>0);
   if ($16) {
    return;
   }
   $17 = HEAP32[(7776)>>2]|0;
   $18 = ($17|0)==($14|0);
   if ($18) {
    $79 = ((($7)) + 4|0);
    $80 = HEAP32[$79>>2]|0;
    $81 = $80 & 3;
    $82 = ($81|0)==(3);
    if (!($82)) {
     $$1 = $14;$$1345 = $15;$87 = $14;
     break;
    }
    $83 = (($14) + ($15)|0);
    $84 = ((($14)) + 4|0);
    $85 = $15 | 1;
    $86 = $80 & -2;
    HEAP32[(7764)>>2] = $15;
    HEAP32[$79>>2] = $86;
    HEAP32[$84>>2] = $85;
    HEAP32[$83>>2] = $15;
    return;
   }
   $19 = $10 >>> 3;
   $20 = ($10>>>0)<(256);
   if ($20) {
    $21 = ((($14)) + 8|0);
    $22 = HEAP32[$21>>2]|0;
    $23 = ((($14)) + 12|0);
    $24 = HEAP32[$23>>2]|0;
    $25 = ($24|0)==($22|0);
    if ($25) {
     $26 = 1 << $19;
     $27 = $26 ^ -1;
     $28 = HEAP32[1939]|0;
     $29 = $28 & $27;
     HEAP32[1939] = $29;
     $$1 = $14;$$1345 = $15;$87 = $14;
     break;
    } else {
     $30 = ((($22)) + 12|0);
     HEAP32[$30>>2] = $24;
     $31 = ((($24)) + 8|0);
     HEAP32[$31>>2] = $22;
     $$1 = $14;$$1345 = $15;$87 = $14;
     break;
    }
   }
   $32 = ((($14)) + 24|0);
   $33 = HEAP32[$32>>2]|0;
   $34 = ((($14)) + 12|0);
   $35 = HEAP32[$34>>2]|0;
   $36 = ($35|0)==($14|0);
   do {
    if ($36) {
     $41 = ((($14)) + 16|0);
     $42 = ((($41)) + 4|0);
     $43 = HEAP32[$42>>2]|0;
     $44 = ($43|0)==(0|0);
     if ($44) {
      $45 = HEAP32[$41>>2]|0;
      $46 = ($45|0)==(0|0);
      if ($46) {
       $$3 = 0;
       break;
      } else {
       $$1350$ph = $45;$$1353$ph = $41;
      }
     } else {
      $$1350$ph = $43;$$1353$ph = $42;
     }
     $$1350 = $$1350$ph;$$1353 = $$1353$ph;
     while(1) {
      $47 = ((($$1350)) + 20|0);
      $48 = HEAP32[$47>>2]|0;
      $49 = ($48|0)==(0|0);
      if ($49) {
       $50 = ((($$1350)) + 16|0);
       $51 = HEAP32[$50>>2]|0;
       $52 = ($51|0)==(0|0);
       if ($52) {
        break;
       } else {
        $$1350$be = $51;$$1353$be = $50;
       }
      } else {
       $$1350$be = $48;$$1353$be = $47;
      }
      $$1350 = $$1350$be;$$1353 = $$1353$be;
     }
     HEAP32[$$1353>>2] = 0;
     $$3 = $$1350;
    } else {
     $37 = ((($14)) + 8|0);
     $38 = HEAP32[$37>>2]|0;
     $39 = ((($38)) + 12|0);
     HEAP32[$39>>2] = $35;
     $40 = ((($35)) + 8|0);
     HEAP32[$40>>2] = $38;
     $$3 = $35;
    }
   } while(0);
   $53 = ($33|0)==(0|0);
   if ($53) {
    $$1 = $14;$$1345 = $15;$87 = $14;
   } else {
    $54 = ((($14)) + 28|0);
    $55 = HEAP32[$54>>2]|0;
    $56 = (8060 + ($55<<2)|0);
    $57 = HEAP32[$56>>2]|0;
    $58 = ($57|0)==($14|0);
    if ($58) {
     HEAP32[$56>>2] = $$3;
     $cond371 = ($$3|0)==(0|0);
     if ($cond371) {
      $59 = 1 << $55;
      $60 = $59 ^ -1;
      $61 = HEAP32[(7760)>>2]|0;
      $62 = $61 & $60;
      HEAP32[(7760)>>2] = $62;
      $$1 = $14;$$1345 = $15;$87 = $14;
      break;
     }
    } else {
     $63 = ((($33)) + 16|0);
     $64 = HEAP32[$63>>2]|0;
     $65 = ($64|0)==($14|0);
     $66 = ((($33)) + 20|0);
     $$sink = $65 ? $63 : $66;
     HEAP32[$$sink>>2] = $$3;
     $67 = ($$3|0)==(0|0);
     if ($67) {
      $$1 = $14;$$1345 = $15;$87 = $14;
      break;
     }
    }
    $68 = ((($$3)) + 24|0);
    HEAP32[$68>>2] = $33;
    $69 = ((($14)) + 16|0);
    $70 = HEAP32[$69>>2]|0;
    $71 = ($70|0)==(0|0);
    if (!($71)) {
     $72 = ((($$3)) + 16|0);
     HEAP32[$72>>2] = $70;
     $73 = ((($70)) + 24|0);
     HEAP32[$73>>2] = $$3;
    }
    $74 = ((($69)) + 4|0);
    $75 = HEAP32[$74>>2]|0;
    $76 = ($75|0)==(0|0);
    if ($76) {
     $$1 = $14;$$1345 = $15;$87 = $14;
    } else {
     $77 = ((($$3)) + 20|0);
     HEAP32[$77>>2] = $75;
     $78 = ((($75)) + 24|0);
     HEAP32[$78>>2] = $$3;
     $$1 = $14;$$1345 = $15;$87 = $14;
    }
   }
  } else {
   $$1 = $2;$$1345 = $6;$87 = $2;
  }
 } while(0);
 $88 = ($87>>>0)<($7>>>0);
 if (!($88)) {
  return;
 }
 $89 = ((($7)) + 4|0);
 $90 = HEAP32[$89>>2]|0;
 $91 = $90 & 1;
 $92 = ($91|0)==(0);
 if ($92) {
  return;
 }
 $93 = $90 & 2;
 $94 = ($93|0)==(0);
 if ($94) {
  $95 = HEAP32[(7780)>>2]|0;
  $96 = ($95|0)==($7|0);
  if ($96) {
   $97 = HEAP32[(7768)>>2]|0;
   $98 = (($97) + ($$1345))|0;
   HEAP32[(7768)>>2] = $98;
   HEAP32[(7780)>>2] = $$1;
   $99 = $98 | 1;
   $100 = ((($$1)) + 4|0);
   HEAP32[$100>>2] = $99;
   $101 = HEAP32[(7776)>>2]|0;
   $102 = ($$1|0)==($101|0);
   if (!($102)) {
    return;
   }
   HEAP32[(7776)>>2] = 0;
   HEAP32[(7764)>>2] = 0;
   return;
  }
  $103 = HEAP32[(7776)>>2]|0;
  $104 = ($103|0)==($7|0);
  if ($104) {
   $105 = HEAP32[(7764)>>2]|0;
   $106 = (($105) + ($$1345))|0;
   HEAP32[(7764)>>2] = $106;
   HEAP32[(7776)>>2] = $87;
   $107 = $106 | 1;
   $108 = ((($$1)) + 4|0);
   HEAP32[$108>>2] = $107;
   $109 = (($87) + ($106)|0);
   HEAP32[$109>>2] = $106;
   return;
  }
  $110 = $90 & -8;
  $111 = (($110) + ($$1345))|0;
  $112 = $90 >>> 3;
  $113 = ($90>>>0)<(256);
  do {
   if ($113) {
    $114 = ((($7)) + 8|0);
    $115 = HEAP32[$114>>2]|0;
    $116 = ((($7)) + 12|0);
    $117 = HEAP32[$116>>2]|0;
    $118 = ($117|0)==($115|0);
    if ($118) {
     $119 = 1 << $112;
     $120 = $119 ^ -1;
     $121 = HEAP32[1939]|0;
     $122 = $121 & $120;
     HEAP32[1939] = $122;
     break;
    } else {
     $123 = ((($115)) + 12|0);
     HEAP32[$123>>2] = $117;
     $124 = ((($117)) + 8|0);
     HEAP32[$124>>2] = $115;
     break;
    }
   } else {
    $125 = ((($7)) + 24|0);
    $126 = HEAP32[$125>>2]|0;
    $127 = ((($7)) + 12|0);
    $128 = HEAP32[$127>>2]|0;
    $129 = ($128|0)==($7|0);
    do {
     if ($129) {
      $134 = ((($7)) + 16|0);
      $135 = ((($134)) + 4|0);
      $136 = HEAP32[$135>>2]|0;
      $137 = ($136|0)==(0|0);
      if ($137) {
       $138 = HEAP32[$134>>2]|0;
       $139 = ($138|0)==(0|0);
       if ($139) {
        $$3363 = 0;
        break;
       } else {
        $$1361$ph = $138;$$1365$ph = $134;
       }
      } else {
       $$1361$ph = $136;$$1365$ph = $135;
      }
      $$1361 = $$1361$ph;$$1365 = $$1365$ph;
      while(1) {
       $140 = ((($$1361)) + 20|0);
       $141 = HEAP32[$140>>2]|0;
       $142 = ($141|0)==(0|0);
       if ($142) {
        $143 = ((($$1361)) + 16|0);
        $144 = HEAP32[$143>>2]|0;
        $145 = ($144|0)==(0|0);
        if ($145) {
         break;
        } else {
         $$1361$be = $144;$$1365$be = $143;
        }
       } else {
        $$1361$be = $141;$$1365$be = $140;
       }
       $$1361 = $$1361$be;$$1365 = $$1365$be;
      }
      HEAP32[$$1365>>2] = 0;
      $$3363 = $$1361;
     } else {
      $130 = ((($7)) + 8|0);
      $131 = HEAP32[$130>>2]|0;
      $132 = ((($131)) + 12|0);
      HEAP32[$132>>2] = $128;
      $133 = ((($128)) + 8|0);
      HEAP32[$133>>2] = $131;
      $$3363 = $128;
     }
    } while(0);
    $146 = ($126|0)==(0|0);
    if (!($146)) {
     $147 = ((($7)) + 28|0);
     $148 = HEAP32[$147>>2]|0;
     $149 = (8060 + ($148<<2)|0);
     $150 = HEAP32[$149>>2]|0;
     $151 = ($150|0)==($7|0);
     if ($151) {
      HEAP32[$149>>2] = $$3363;
      $cond372 = ($$3363|0)==(0|0);
      if ($cond372) {
       $152 = 1 << $148;
       $153 = $152 ^ -1;
       $154 = HEAP32[(7760)>>2]|0;
       $155 = $154 & $153;
       HEAP32[(7760)>>2] = $155;
       break;
      }
     } else {
      $156 = ((($126)) + 16|0);
      $157 = HEAP32[$156>>2]|0;
      $158 = ($157|0)==($7|0);
      $159 = ((($126)) + 20|0);
      $$sink395 = $158 ? $156 : $159;
      HEAP32[$$sink395>>2] = $$3363;
      $160 = ($$3363|0)==(0|0);
      if ($160) {
       break;
      }
     }
     $161 = ((($$3363)) + 24|0);
     HEAP32[$161>>2] = $126;
     $162 = ((($7)) + 16|0);
     $163 = HEAP32[$162>>2]|0;
     $164 = ($163|0)==(0|0);
     if (!($164)) {
      $165 = ((($$3363)) + 16|0);
      HEAP32[$165>>2] = $163;
      $166 = ((($163)) + 24|0);
      HEAP32[$166>>2] = $$3363;
     }
     $167 = ((($162)) + 4|0);
     $168 = HEAP32[$167>>2]|0;
     $169 = ($168|0)==(0|0);
     if (!($169)) {
      $170 = ((($$3363)) + 20|0);
      HEAP32[$170>>2] = $168;
      $171 = ((($168)) + 24|0);
      HEAP32[$171>>2] = $$3363;
     }
    }
   }
  } while(0);
  $172 = $111 | 1;
  $173 = ((($$1)) + 4|0);
  HEAP32[$173>>2] = $172;
  $174 = (($87) + ($111)|0);
  HEAP32[$174>>2] = $111;
  $175 = HEAP32[(7776)>>2]|0;
  $176 = ($$1|0)==($175|0);
  if ($176) {
   HEAP32[(7764)>>2] = $111;
   return;
  } else {
   $$2 = $111;
  }
 } else {
  $177 = $90 & -2;
  HEAP32[$89>>2] = $177;
  $178 = $$1345 | 1;
  $179 = ((($$1)) + 4|0);
  HEAP32[$179>>2] = $178;
  $180 = (($87) + ($$1345)|0);
  HEAP32[$180>>2] = $$1345;
  $$2 = $$1345;
 }
 $181 = $$2 >>> 3;
 $182 = ($$2>>>0)<(256);
 if ($182) {
  $183 = $181 << 1;
  $184 = (7796 + ($183<<2)|0);
  $185 = HEAP32[1939]|0;
  $186 = 1 << $181;
  $187 = $185 & $186;
  $188 = ($187|0)==(0);
  if ($188) {
   $189 = $185 | $186;
   HEAP32[1939] = $189;
   $$pre = ((($184)) + 8|0);
   $$0366 = $184;$$pre$phiZ2D = $$pre;
  } else {
   $190 = ((($184)) + 8|0);
   $191 = HEAP32[$190>>2]|0;
   $$0366 = $191;$$pre$phiZ2D = $190;
  }
  HEAP32[$$pre$phiZ2D>>2] = $$1;
  $192 = ((($$0366)) + 12|0);
  HEAP32[$192>>2] = $$1;
  $193 = ((($$1)) + 8|0);
  HEAP32[$193>>2] = $$0366;
  $194 = ((($$1)) + 12|0);
  HEAP32[$194>>2] = $184;
  return;
 }
 $195 = $$2 >>> 8;
 $196 = ($195|0)==(0);
 if ($196) {
  $$0359 = 0;
 } else {
  $197 = ($$2>>>0)>(16777215);
  if ($197) {
   $$0359 = 31;
  } else {
   $198 = (($195) + 1048320)|0;
   $199 = $198 >>> 16;
   $200 = $199 & 8;
   $201 = $195 << $200;
   $202 = (($201) + 520192)|0;
   $203 = $202 >>> 16;
   $204 = $203 & 4;
   $205 = $204 | $200;
   $206 = $201 << $204;
   $207 = (($206) + 245760)|0;
   $208 = $207 >>> 16;
   $209 = $208 & 2;
   $210 = $205 | $209;
   $211 = (14 - ($210))|0;
   $212 = $206 << $209;
   $213 = $212 >>> 15;
   $214 = (($211) + ($213))|0;
   $215 = $214 << 1;
   $216 = (($214) + 7)|0;
   $217 = $$2 >>> $216;
   $218 = $217 & 1;
   $219 = $218 | $215;
   $$0359 = $219;
  }
 }
 $220 = (8060 + ($$0359<<2)|0);
 $221 = ((($$1)) + 28|0);
 HEAP32[$221>>2] = $$0359;
 $222 = ((($$1)) + 16|0);
 $223 = ((($$1)) + 20|0);
 HEAP32[$223>>2] = 0;
 HEAP32[$222>>2] = 0;
 $224 = HEAP32[(7760)>>2]|0;
 $225 = 1 << $$0359;
 $226 = $224 & $225;
 $227 = ($226|0)==(0);
 L112: do {
  if ($227) {
   $228 = $224 | $225;
   HEAP32[(7760)>>2] = $228;
   HEAP32[$220>>2] = $$1;
   $229 = ((($$1)) + 24|0);
   HEAP32[$229>>2] = $220;
   $230 = ((($$1)) + 12|0);
   HEAP32[$230>>2] = $$1;
   $231 = ((($$1)) + 8|0);
   HEAP32[$231>>2] = $$1;
  } else {
   $232 = HEAP32[$220>>2]|0;
   $233 = ((($232)) + 4|0);
   $234 = HEAP32[$233>>2]|0;
   $235 = $234 & -8;
   $236 = ($235|0)==($$2|0);
   L115: do {
    if ($236) {
     $$0347$lcssa = $232;
    } else {
     $237 = ($$0359|0)==(31);
     $238 = $$0359 >>> 1;
     $239 = (25 - ($238))|0;
     $240 = $237 ? 0 : $239;
     $241 = $$2 << $240;
     $$0346381 = $241;$$0347380 = $232;
     while(1) {
      $248 = $$0346381 >>> 31;
      $249 = (((($$0347380)) + 16|0) + ($248<<2)|0);
      $244 = HEAP32[$249>>2]|0;
      $250 = ($244|0)==(0|0);
      if ($250) {
       break;
      }
      $242 = $$0346381 << 1;
      $243 = ((($244)) + 4|0);
      $245 = HEAP32[$243>>2]|0;
      $246 = $245 & -8;
      $247 = ($246|0)==($$2|0);
      if ($247) {
       $$0347$lcssa = $244;
       break L115;
      } else {
       $$0346381 = $242;$$0347380 = $244;
      }
     }
     HEAP32[$249>>2] = $$1;
     $251 = ((($$1)) + 24|0);
     HEAP32[$251>>2] = $$0347380;
     $252 = ((($$1)) + 12|0);
     HEAP32[$252>>2] = $$1;
     $253 = ((($$1)) + 8|0);
     HEAP32[$253>>2] = $$1;
     break L112;
    }
   } while(0);
   $254 = ((($$0347$lcssa)) + 8|0);
   $255 = HEAP32[$254>>2]|0;
   $256 = ((($255)) + 12|0);
   HEAP32[$256>>2] = $$1;
   HEAP32[$254>>2] = $$1;
   $257 = ((($$1)) + 8|0);
   HEAP32[$257>>2] = $255;
   $258 = ((($$1)) + 12|0);
   HEAP32[$258>>2] = $$0347$lcssa;
   $259 = ((($$1)) + 24|0);
   HEAP32[$259>>2] = 0;
  }
 } while(0);
 $260 = HEAP32[(7788)>>2]|0;
 $261 = (($260) + -1)|0;
 HEAP32[(7788)>>2] = $261;
 $262 = ($261|0)==(0);
 if (!($262)) {
  return;
 }
 $$0194$in$i = (8212);
 while(1) {
  $$0194$i = HEAP32[$$0194$in$i>>2]|0;
  $263 = ($$0194$i|0)==(0|0);
  $264 = ((($$0194$i)) + 8|0);
  if ($263) {
   break;
  } else {
   $$0194$in$i = $264;
  }
 }
 HEAP32[(7788)>>2] = -1;
 return;
}
function __Znwm($0) {
 $0 = $0|0;
 var $$lcssa = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $spec$store$select = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0);
 $spec$store$select = $1 ? 1 : $0;
 while(1) {
  $2 = (_malloc($spec$store$select)|0);
  $3 = ($2|0)==(0|0);
  if (!($3)) {
   $$lcssa = $2;
   break;
  }
  $4 = (__ZSt15get_new_handlerv()|0);
  $5 = ($4|0)==(0|0);
  if ($5) {
   $$lcssa = 0;
   break;
  }
  FUNCTION_TABLE_v[$4 & 63]();
 }
 return ($$lcssa|0);
}
function __ZdlPv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _free($0);
 return;
}
function __ZNSt3__218__libcpp_refstringC2EPKc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (_strlen($1)|0);
 $3 = (($2) + 13)|0;
 $4 = (__Znwm($3)|0);
 HEAP32[$4>>2] = $2;
 $5 = ((($4)) + 4|0);
 HEAP32[$5>>2] = $2;
 $6 = ((($4)) + 8|0);
 HEAP32[$6>>2] = 0;
 $7 = (__ZNSt3__215__refstring_imp12_GLOBAL__N_113data_from_repEPNS1_9_Rep_baseE($4)|0);
 $8 = (($2) + 1)|0;
 _memcpy(($7|0),($1|0),($8|0))|0;
 HEAP32[$0>>2] = $7;
 return;
}
function __ZNSt3__215__refstring_imp12_GLOBAL__N_113data_from_repEPNS1_9_Rep_baseE($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 12|0);
 return ($1|0);
}
function __ZNSt11logic_errorC2EPKc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAP32[$0>>2] = (3624);
 $2 = ((($0)) + 4|0);
 __ZNSt3__218__libcpp_refstringC2EPKc($2,$1);
 return;
}
function __ZNKSt3__218__libcpp_refstring15__uses_refcountEv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 1;
}
function __ZNKSt3__221__basic_string_commonILb1EE20__throw_length_errorEv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _abort();
 // unreachable;
}
function __ZNKSt3__221__basic_string_commonILb1EE20__throw_out_of_rangeEv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _abort();
 // unreachable;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 ;HEAP32[$0>>2]=0|0;HEAP32[$0+4>>2]=0|0;HEAP32[$0+8>>2]=0|0;
 $2 = ((($1)) + 11|0);
 $3 = HEAP8[$2>>0]|0;
 $4 = ($3<<24>>24)<(0);
 if ($4) {
  $5 = HEAP32[$1>>2]|0;
  $6 = ((($1)) + 4|0);
  $7 = HEAP32[$6>>2]|0;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($0,$5,$7);
 } else {
  ;HEAP32[$0>>2]=HEAP32[$1>>2]|0;HEAP32[$0+4>>2]=HEAP32[$1+4>>2]|0;HEAP32[$0+8>>2]=HEAP32[$1+8>>2]|0;
 }
 return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = sp;
 $4 = ($2>>>0)>(4294967279);
 if ($4) {
  __ZNKSt3__221__basic_string_commonILb1EE20__throw_length_errorEv($0);
  // unreachable;
 }
 $5 = ($2>>>0)<(11);
 if ($5) {
  $6 = $2&255;
  $7 = ((($0)) + 11|0);
  HEAP8[$7>>0] = $6;
  $$0 = $0;
 } else {
  $8 = (($2) + 16)|0;
  $9 = $8 & -16;
  $10 = (__Znwm($9)|0);
  HEAP32[$0>>2] = $10;
  $11 = $9 | -2147483648;
  $12 = ((($0)) + 8|0);
  HEAP32[$12>>2] = $11;
  $13 = ((($0)) + 4|0);
  HEAP32[$13>>2] = $2;
  $$0 = $10;
 }
 (__ZNSt3__211char_traitsIcE4copyEPcPKcm($$0,$1,$2)|0);
 $14 = (($$0) + ($2)|0);
 HEAP8[$3>>0] = 0;
 __ZNSt3__211char_traitsIcE6assignERcRKc($14,$3);
 STACKTOP = sp;return;
}
function __ZNSt3__211char_traitsIcE4copyEPcPKcm($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($2|0)==(0);
 if (!($3)) {
  _memcpy(($0|0),($1|0),($2|0))|0;
 }
 return ($0|0);
}
function __ZNSt3__211char_traitsIcE6assignERcRKc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = HEAP8[$1>>0]|0;
 HEAP8[$0>>0] = $2;
 return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 11|0);
 $2 = HEAP8[$1>>0]|0;
 $3 = ($2<<24>>24)<(0);
 if ($3) {
  $4 = HEAP32[$0>>2]|0;
  __ZdlPv($4);
 }
 return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEaSERKS5_($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($0|0)==($1|0);
 if (!($2)) {
  $3 = ((($1)) + 11|0);
  $4 = HEAP8[$3>>0]|0;
  $5 = ($4<<24>>24)<(0);
  $6 = HEAP32[$1>>2]|0;
  $7 = ((($1)) + 4|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = $4&255;
  $10 = $5 ? $6 : $1;
  $11 = $5 ? $8 : $9;
  (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6assignEPKcm($0,$10,$11)|0);
 }
 return ($0|0);
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6assignEPKcm($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, $phitmp$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = sp;
 $4 = ((($0)) + 11|0);
 $5 = HEAP8[$4>>0]|0;
 $6 = ($5<<24>>24)<(0);
 if ($6) {
  $7 = ((($0)) + 8|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = $8 & 2147483647;
  $phitmp$i = (($9) + -1)|0;
  $10 = $phitmp$i;
 } else {
  $10 = 10;
 }
 $11 = ($10>>>0)<($2>>>0);
 do {
  if ($11) {
   if ($6) {
    $19 = ((($0)) + 4|0);
    $20 = HEAP32[$19>>2]|0;
    $23 = $20;
   } else {
    $21 = $5&255;
    $23 = $21;
   }
   $22 = (($2) - ($10))|0;
   __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE21__grow_by_and_replaceEmmmmmmPKc($0,$10,$22,$23,0,$23,$2,$1);
  } else {
   if ($6) {
    $12 = HEAP32[$0>>2]|0;
    $13 = $12;
   } else {
    $13 = $0;
   }
   (__ZNSt3__211char_traitsIcE4moveEPcPKcm($13,$1,$2)|0);
   $14 = (($13) + ($2)|0);
   HEAP8[$3>>0] = 0;
   __ZNSt3__211char_traitsIcE6assignERcRKc($14,$3);
   $15 = HEAP8[$4>>0]|0;
   $16 = ($15<<24>>24)<(0);
   if ($16) {
    $17 = ((($0)) + 4|0);
    HEAP32[$17>>2] = $2;
    break;
   } else {
    $18 = $2&255;
    HEAP8[$4>>0] = $18;
    break;
   }
  }
 } while(0);
 STACKTOP = sp;return ($0|0);
}
function __ZNSt3__211char_traitsIcE4moveEPcPKcm($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($2|0)==(0);
 if (!($3)) {
  _memmove(($0|0),($1|0),($2|0))|0;
 }
 return ($0|0);
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE21__grow_by_and_replaceEmmmmmmPKc($0,$1,$2,$3,$4,$5,$6,$7) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 $6 = $6|0;
 $7 = $7|0;
 var $$sroa$speculated = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $8 = 0, $9 = 0, $phitmp = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $8 = sp;
 $9 = (-18 - ($1))|0;
 $10 = ($9>>>0)<($2>>>0);
 if ($10) {
  __ZNKSt3__221__basic_string_commonILb1EE20__throw_length_errorEv($0);
  // unreachable;
 }
 $11 = ((($0)) + 11|0);
 $12 = HEAP8[$11>>0]|0;
 $13 = ($12<<24>>24)<(0);
 if ($13) {
  $14 = HEAP32[$0>>2]|0;
  $25 = $14;
 } else {
  $25 = $0;
 }
 $15 = ($1>>>0)<(2147483623);
 if ($15) {
  $16 = (($2) + ($1))|0;
  $17 = $1 << 1;
  $18 = ($16>>>0)<($17>>>0);
  $$sroa$speculated = $18 ? $17 : $16;
  $19 = ($$sroa$speculated>>>0)<(11);
  $20 = (($$sroa$speculated) + 16)|0;
  $21 = $20 & -16;
  $phitmp = $19 ? 11 : $21;
  $22 = $phitmp;
 } else {
  $22 = -17;
 }
 $23 = (__Znwm($22)|0);
 $24 = ($4|0)==(0);
 if (!($24)) {
  (__ZNSt3__211char_traitsIcE4copyEPcPKcm($23,$25,$4)|0);
 }
 $26 = ($6|0)==(0);
 if (!($26)) {
  $27 = (($23) + ($4)|0);
  (__ZNSt3__211char_traitsIcE4copyEPcPKcm($27,$7,$6)|0);
 }
 $28 = (($3) - ($5))|0;
 $29 = (($28) - ($4))|0;
 $30 = ($29|0)==(0);
 if (!($30)) {
  $31 = (($23) + ($4)|0);
  $32 = (($31) + ($6)|0);
  $33 = (($25) + ($4)|0);
  $34 = (($33) + ($5)|0);
  (__ZNSt3__211char_traitsIcE4copyEPcPKcm($32,$34,$29)|0);
 }
 $35 = ($1|0)==(10);
 if (!($35)) {
  __ZdlPv($25);
 }
 HEAP32[$0>>2] = $23;
 $36 = $22 | -2147483648;
 $37 = ((($0)) + 8|0);
 HEAP32[$37>>2] = $36;
 $38 = (($28) + ($6))|0;
 $39 = ((($0)) + 4|0);
 HEAP32[$39>>2] = $38;
 $40 = (($23) + ($38)|0);
 HEAP8[$8>>0] = 0;
 __ZNSt3__211char_traitsIcE6assignERcRKc($40,$8);
 STACKTOP = sp;return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm($0,$1,$2,$3,$4,$5,$6) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 $6 = $6|0;
 var $$sroa$speculated = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $7 = 0, $8 = 0, $9 = 0, $phitmp = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $7 = (-17 - ($1))|0;
 $8 = ($7>>>0)<($2>>>0);
 if ($8) {
  __ZNKSt3__221__basic_string_commonILb1EE20__throw_length_errorEv($0);
  // unreachable;
 }
 $9 = ((($0)) + 11|0);
 $10 = HEAP8[$9>>0]|0;
 $11 = ($10<<24>>24)<(0);
 if ($11) {
  $12 = HEAP32[$0>>2]|0;
  $23 = $12;
 } else {
  $23 = $0;
 }
 $13 = ($1>>>0)<(2147483623);
 if ($13) {
  $14 = (($2) + ($1))|0;
  $15 = $1 << 1;
  $16 = ($14>>>0)<($15>>>0);
  $$sroa$speculated = $16 ? $15 : $14;
  $17 = ($$sroa$speculated>>>0)<(11);
  $18 = (($$sroa$speculated) + 16)|0;
  $19 = $18 & -16;
  $phitmp = $17 ? 11 : $19;
  $20 = $phitmp;
 } else {
  $20 = -17;
 }
 $21 = (__Znwm($20)|0);
 $22 = ($4|0)==(0);
 if (!($22)) {
  (__ZNSt3__211char_traitsIcE4copyEPcPKcm($21,$23,$4)|0);
 }
 $24 = (($3) - ($5))|0;
 $25 = (($24) - ($4))|0;
 $26 = ($25|0)==(0);
 if (!($26)) {
  $27 = (($21) + ($4)|0);
  $28 = (($27) + ($6)|0);
  $29 = (($23) + ($4)|0);
  $30 = (($29) + ($5)|0);
  (__ZNSt3__211char_traitsIcE4copyEPcPKcm($28,$30,$25)|0);
 }
 $31 = ($1|0)==(10);
 if (!($31)) {
  __ZdlPv($23);
 }
 HEAP32[$0>>2] = $21;
 $32 = $20 | -2147483648;
 $33 = ((($0)) + 8|0);
 HEAP32[$33>>2] = $32;
 return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $3 = 0;
 var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $phitmp$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = sp;
 $4 = ((($0)) + 11|0);
 $5 = HEAP8[$4>>0]|0;
 $6 = ($5<<24>>24)<(0);
 if ($6) {
  $7 = ((($0)) + 8|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = $8 & 2147483647;
  $phitmp$i = (($9) + -1)|0;
  $10 = ((($0)) + 4|0);
  $11 = HEAP32[$10>>2]|0;
  $14 = $phitmp$i;$15 = $11;
 } else {
  $12 = $5&255;
  $14 = 10;$15 = $12;
 }
 $13 = (($14) - ($15))|0;
 $16 = ($13>>>0)<($2>>>0);
 if ($16) {
  $27 = (($15) + ($2))|0;
  $28 = (($27) - ($14))|0;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE21__grow_by_and_replaceEmmmmmmPKc($0,$14,$28,$15,$15,0,$2,$1);
 } else {
  $17 = ($2|0)==(0);
  if (!($17)) {
   if ($6) {
    $18 = HEAP32[$0>>2]|0;
    $20 = $18;
   } else {
    $20 = $0;
   }
   $19 = (($20) + ($15)|0);
   (__ZNSt3__211char_traitsIcE4copyEPcPKcm($19,$1,$2)|0);
   $21 = (($15) + ($2))|0;
   $22 = HEAP8[$4>>0]|0;
   $23 = ($22<<24>>24)<(0);
   if ($23) {
    $24 = ((($0)) + 4|0);
    HEAP32[$24>>2] = $21;
   } else {
    $25 = $21&255;
    HEAP8[$4>>0] = $25;
   }
   $26 = (($20) + ($21)|0);
   HEAP8[$3>>0] = 0;
   __ZNSt3__211char_traitsIcE6assignERcRKc($26,$3);
  }
 }
 STACKTOP = sp;return ($0|0);
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (__ZNSt3__211char_traitsIcE6lengthEPKc($1)|0);
 $3 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm($0,$1,$2)|0);
 return ($3|0);
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $$018 = 0, $$019 = 0, $$pn = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = sp + 1|0;
 $3 = sp;
 HEAP8[$2>>0] = $1;
 $4 = ((($0)) + 11|0);
 $5 = HEAP8[$4>>0]|0;
 $6 = ($5<<24>>24)<(0);
 if ($6) {
  $8 = ((($0)) + 8|0);
  $9 = HEAP32[$8>>2]|0;
  $10 = $9 & 2147483647;
  $11 = (($10) + -1)|0;
  $12 = ((($0)) + 4|0);
  $13 = HEAP32[$12>>2]|0;
  $$018 = $13;$$019 = $11;
 } else {
  $7 = $5&255;
  $$018 = $7;$$019 = 10;
 }
 $14 = ($$018|0)==($$019|0);
 if ($14) {
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm($0,$$019,1,$$019,$$019,0,0);
  $15 = HEAP8[$4>>0]|0;
  $16 = ($15<<24>>24)<(0);
  if ($16) {
   label = 8;
  } else {
   label = 7;
  }
 } else {
  if ($6) {
   label = 8;
  } else {
   label = 7;
  }
 }
 if ((label|0) == 7) {
  $17 = (($$018) + 1)|0;
  $18 = $17&255;
  HEAP8[$4>>0] = $18;
  $$pn = $0;
 }
 else if ((label|0) == 8) {
  $19 = HEAP32[$0>>2]|0;
  $20 = (($$018) + 1)|0;
  $21 = ((($0)) + 4|0);
  HEAP32[$21>>2] = $20;
  $$pn = $19;
 }
 $$0 = (($$pn) + ($$018)|0);
 __ZNSt3__211char_traitsIcE6assignERcRKc($$0,$2);
 $22 = ((($$0)) + 1|0);
 HEAP8[$3>>0] = 0;
 __ZNSt3__211char_traitsIcE6assignERcRKc($22,$3);
 STACKTOP = sp;return;
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKcm($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$0 = 0, $$1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $phitmp$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $4 = sp;
 $5 = ((($0)) + 11|0);
 $6 = HEAP8[$5>>0]|0;
 $7 = ($6<<24>>24)<(0);
 if ($7) {
  $8 = ((($0)) + 4|0);
  $9 = HEAP32[$8>>2]|0;
  $11 = $9;
 } else {
  $10 = $6&255;
  $11 = $10;
 }
 $12 = ($11>>>0)<($1>>>0);
 if ($12) {
  __ZNKSt3__221__basic_string_commonILb1EE20__throw_out_of_rangeEv($0);
  // unreachable;
 }
 if ($7) {
  $13 = ((($0)) + 8|0);
  $14 = HEAP32[$13>>2]|0;
  $15 = $14 & 2147483647;
  $phitmp$i = (($15) + -1)|0;
  $17 = $phitmp$i;
 } else {
  $17 = 10;
 }
 $16 = (($17) - ($11))|0;
 $18 = ($16>>>0)<($3>>>0);
 if ($18) {
  $36 = (($11) + ($3))|0;
  $37 = (($36) - ($17))|0;
  __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE21__grow_by_and_replaceEmmmmmmPKc($0,$17,$37,$11,$1,0,$3,$2);
 } else {
  $19 = ($3|0)==(0);
  if (!($19)) {
   if ($7) {
    $20 = HEAP32[$0>>2]|0;
    $24 = $20;
   } else {
    $24 = $0;
   }
   $21 = (($11) - ($1))|0;
   $22 = ($21|0)==(0);
   $23 = (($24) + ($1)|0);
   if ($22) {
    $$1 = $2;
   } else {
    $25 = (($23) + ($3)|0);
    $26 = ($23>>>0)<=($2>>>0);
    $27 = (($24) + ($11)|0);
    $28 = ($27>>>0)>($2>>>0);
    $or$cond = $26 & $28;
    $29 = (($2) + ($3)|0);
    $$0 = $or$cond ? $29 : $2;
    (__ZNSt3__211char_traitsIcE4moveEPcPKcm($25,$23,$21)|0);
    $$1 = $$0;
   }
   (__ZNSt3__211char_traitsIcE4moveEPcPKcm($23,$$1,$3)|0);
   $30 = (($11) + ($3))|0;
   $31 = HEAP8[$5>>0]|0;
   $32 = ($31<<24>>24)<(0);
   if ($32) {
    $33 = ((($0)) + 4|0);
    HEAP32[$33>>2] = $30;
   } else {
    $34 = $30&255;
    HEAP8[$5>>0] = $34;
   }
   $35 = (($24) + ($30)|0);
   HEAP8[$4>>0] = 0;
   __ZNSt3__211char_traitsIcE6assignERcRKc($35,$4);
  }
 }
 STACKTOP = sp;return ($0|0);
}
function __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKc($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = (__ZNSt3__211char_traitsIcE6lengthEPKc($2)|0);
 $4 = (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKcm($0,$1,$2,$3)|0);
 return ($4|0);
}
function __ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _abort();
 // unreachable;
}
function __ZL25default_terminate_handlerv() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer10 = 0, $vararg_buffer3 = 0, $vararg_buffer7 = 0, $vararg_ptr1 = 0;
 var $vararg_ptr2 = 0, $vararg_ptr6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $vararg_buffer10 = sp + 32|0;
 $vararg_buffer7 = sp + 24|0;
 $vararg_buffer3 = sp + 16|0;
 $vararg_buffer = sp;
 $0 = sp + 36|0;
 $1 = (___cxa_get_globals_fast()|0);
 $2 = ($1|0)==(0|0);
 if (!($2)) {
  $3 = HEAP32[$1>>2]|0;
  $4 = ($3|0)==(0|0);
  if (!($4)) {
   $5 = ((($3)) + 80|0);
   $6 = ((($3)) + 48|0);
   $7 = $6;
   $8 = $7;
   $9 = HEAP32[$8>>2]|0;
   $10 = (($7) + 4)|0;
   $11 = $10;
   $12 = HEAP32[$11>>2]|0;
   $13 = $9 & -256;
   $14 = ($13|0)==(1126902528);
   $15 = ($12|0)==(1129074247);
   $16 = $14 & $15;
   if (!($16)) {
    HEAP32[$vararg_buffer7>>2] = 6076;
    _abort_message(6026,$vararg_buffer7);
    // unreachable;
   }
   $17 = ($9|0)==(1126902529);
   $18 = ($12|0)==(1129074247);
   $19 = $17 & $18;
   if ($19) {
    $20 = ((($3)) + 44|0);
    $21 = HEAP32[$20>>2]|0;
    $22 = $21;
   } else {
    $22 = $5;
   }
   HEAP32[$0>>2] = $22;
   $23 = HEAP32[$3>>2]|0;
   $24 = ((($23)) + 4|0);
   $25 = HEAP32[$24>>2]|0;
   $26 = HEAP32[678]|0;
   $27 = ((($26)) + 16|0);
   $28 = HEAP32[$27>>2]|0;
   $29 = (FUNCTION_TABLE_iiii[$28 & 63](2712,$23,$0)|0);
   if ($29) {
    $30 = HEAP32[$0>>2]|0;
    $31 = HEAP32[$30>>2]|0;
    $32 = ((($31)) + 8|0);
    $33 = HEAP32[$32>>2]|0;
    $34 = (FUNCTION_TABLE_ii[$33 & 63]($30)|0);
    HEAP32[$vararg_buffer>>2] = 6076;
    $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
    HEAP32[$vararg_ptr1>>2] = $25;
    $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
    HEAP32[$vararg_ptr2>>2] = $34;
    _abort_message(5940,$vararg_buffer);
    // unreachable;
   } else {
    HEAP32[$vararg_buffer3>>2] = 6076;
    $vararg_ptr6 = ((($vararg_buffer3)) + 4|0);
    HEAP32[$vararg_ptr6>>2] = $25;
    _abort_message(5985,$vararg_buffer3);
    // unreachable;
   }
  }
 }
 _abort_message(6064,$vararg_buffer10);
 // unreachable;
}
function ___cxa_get_globals_fast() {
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 $0 = (_pthread_once((8252|0),(52|0))|0);
 $1 = ($0|0)==(0);
 if ($1) {
  $2 = HEAP32[2064]|0;
  $3 = (_pthread_getspecific(($2|0))|0);
  STACKTOP = sp;return ($3|0);
 } else {
  _abort_message(6215,$vararg_buffer);
  // unreachable;
 }
 return (0)|0;
}
function _abort_message($0,$varargs) {
 $0 = $0|0;
 $varargs = $varargs|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp;
 HEAP32[$1>>2] = $varargs;
 $2 = HEAP32[758]|0;
 (_vfprintf($2,$0,$1)|0);
 (_fputc(10,$2)|0);
 _abort();
 // unreachable;
}
function __ZN10__cxxabiv116__shim_type_infoD2Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZN10__cxxabiv117__class_type_infoD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10__cxxabiv116__shim_type_infoD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNK10__cxxabiv116__shim_type_info5noop1Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZNK10__cxxabiv116__shim_type_info5noop2Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $$2 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $3 = sp;
 $4 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$1,0)|0);
 if ($4) {
  $$2 = 1;
 } else {
  $5 = ($1|0)==(0|0);
  if ($5) {
   $$2 = 0;
  } else {
   $6 = (___dynamic_cast($1,2736,2720,0)|0);
   $7 = ($6|0)==(0|0);
   if ($7) {
    $$2 = 0;
   } else {
    $8 = ((($3)) + 4|0);
    dest=$8; stop=dest+52|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
    HEAP32[$3>>2] = $6;
    $9 = ((($3)) + 8|0);
    HEAP32[$9>>2] = $0;
    $10 = ((($3)) + 12|0);
    HEAP32[$10>>2] = -1;
    $11 = ((($3)) + 48|0);
    HEAP32[$11>>2] = 1;
    $12 = HEAP32[$6>>2]|0;
    $13 = ((($12)) + 28|0);
    $14 = HEAP32[$13>>2]|0;
    $15 = HEAP32[$2>>2]|0;
    FUNCTION_TABLE_viiii[$14 & 63]($6,$3,$15,1);
    $16 = ((($3)) + 24|0);
    $17 = HEAP32[$16>>2]|0;
    $18 = ($17|0)==(1);
    if ($18) {
     $19 = ((($3)) + 16|0);
     $20 = HEAP32[$19>>2]|0;
     HEAP32[$2>>2] = $20;
     $$0 = 1;
    } else {
     $$0 = 0;
    }
    $$2 = $$0;
   }
  }
 }
 STACKTOP = sp;return ($$2|0);
}
function __ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $6 = ((($1)) + 8|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$7,$5)|0);
 if ($8) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$1,$2,$3,$4);
 }
 return;
}
function __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $5 = ((($1)) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$6,$4)|0);
 do {
  if ($7) {
   __ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi(0,$1,$2,$3);
  } else {
   $8 = HEAP32[$1>>2]|0;
   $9 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$8,$4)|0);
   if ($9) {
    $10 = ((($1)) + 16|0);
    $11 = HEAP32[$10>>2]|0;
    $12 = ($11|0)==($2|0);
    if (!($12)) {
     $13 = ((($1)) + 20|0);
     $14 = HEAP32[$13>>2]|0;
     $15 = ($14|0)==($2|0);
     if (!($15)) {
      $18 = ((($1)) + 32|0);
      HEAP32[$18>>2] = $3;
      HEAP32[$13>>2] = $2;
      $19 = ((($1)) + 40|0);
      $20 = HEAP32[$19>>2]|0;
      $21 = (($20) + 1)|0;
      HEAP32[$19>>2] = $21;
      $22 = ((($1)) + 36|0);
      $23 = HEAP32[$22>>2]|0;
      $24 = ($23|0)==(1);
      if ($24) {
       $25 = ((($1)) + 24|0);
       $26 = HEAP32[$25>>2]|0;
       $27 = ($26|0)==(2);
       if ($27) {
        $28 = ((($1)) + 54|0);
        HEAP8[$28>>0] = 1;
       }
      }
      $29 = ((($1)) + 44|0);
      HEAP32[$29>>2] = 4;
      break;
     }
    }
    $16 = ($3|0)==(1);
    if ($16) {
     $17 = ((($1)) + 32|0);
     HEAP32[$17>>2] = 1;
    }
   }
  }
 } while(0);
 return;
}
function __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $4 = 0, $5 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($1)) + 8|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$5,0)|0);
 if ($6) {
  __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$1,$2,$3);
 }
 return;
}
function __ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($0|0)==($1|0);
 return ($3|0);
}
function __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($1)) + 16|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = ($5|0)==(0|0);
 do {
  if ($6) {
   HEAP32[$4>>2] = $2;
   $7 = ((($1)) + 24|0);
   HEAP32[$7>>2] = $3;
   $8 = ((($1)) + 36|0);
   HEAP32[$8>>2] = 1;
  } else {
   $9 = ($5|0)==($2|0);
   if (!($9)) {
    $13 = ((($1)) + 36|0);
    $14 = HEAP32[$13>>2]|0;
    $15 = (($14) + 1)|0;
    HEAP32[$13>>2] = $15;
    $16 = ((($1)) + 24|0);
    HEAP32[$16>>2] = 2;
    $17 = ((($1)) + 54|0);
    HEAP8[$17>>0] = 1;
    break;
   }
   $10 = ((($1)) + 24|0);
   $11 = HEAP32[$10>>2]|0;
   $12 = ($11|0)==(2);
   if ($12) {
    HEAP32[$10>>2] = $3;
   }
  }
 } while(0);
 return;
}
function __ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($1)) + 4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = ($5|0)==($2|0);
 if ($6) {
  $7 = ((($1)) + 28|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = ($8|0)==(1);
  if (!($9)) {
   HEAP32[$7>>2] = $3;
  }
 }
 return;
}
function __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond22 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $5 = ((($1)) + 53|0);
 HEAP8[$5>>0] = 1;
 $6 = ((($1)) + 4|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = ($7|0)==($3|0);
 do {
  if ($8) {
   $9 = ((($1)) + 52|0);
   HEAP8[$9>>0] = 1;
   $10 = ((($1)) + 16|0);
   $11 = HEAP32[$10>>2]|0;
   $12 = ($11|0)==(0|0);
   if ($12) {
    HEAP32[$10>>2] = $2;
    $13 = ((($1)) + 24|0);
    HEAP32[$13>>2] = $4;
    $14 = ((($1)) + 36|0);
    HEAP32[$14>>2] = 1;
    $15 = ((($1)) + 48|0);
    $16 = HEAP32[$15>>2]|0;
    $17 = ($16|0)==(1);
    $18 = ($4|0)==(1);
    $or$cond = $18 & $17;
    if (!($or$cond)) {
     break;
    }
    $19 = ((($1)) + 54|0);
    HEAP8[$19>>0] = 1;
    break;
   }
   $20 = ($11|0)==($2|0);
   if (!($20)) {
    $30 = ((($1)) + 36|0);
    $31 = HEAP32[$30>>2]|0;
    $32 = (($31) + 1)|0;
    HEAP32[$30>>2] = $32;
    $33 = ((($1)) + 54|0);
    HEAP8[$33>>0] = 1;
    break;
   }
   $21 = ((($1)) + 24|0);
   $22 = HEAP32[$21>>2]|0;
   $23 = ($22|0)==(2);
   if ($23) {
    HEAP32[$21>>2] = $4;
    $27 = $4;
   } else {
    $27 = $22;
   }
   $24 = ((($1)) + 48|0);
   $25 = HEAP32[$24>>2]|0;
   $26 = ($25|0)==(1);
   $28 = ($27|0)==(1);
   $or$cond22 = $26 & $28;
   if ($or$cond22) {
    $29 = ((($1)) + 54|0);
    HEAP8[$29>>0] = 1;
   }
  }
 } while(0);
 return;
}
function ___dynamic_cast($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond28 = 0, $or$cond30 = 0, $or$cond32 = 0, $spec$select = 0, $spec$select33 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $4 = sp;
 $5 = HEAP32[$0>>2]|0;
 $6 = ((($5)) + -8|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (($0) + ($7)|0);
 $9 = ((($5)) + -4|0);
 $10 = HEAP32[$9>>2]|0;
 HEAP32[$4>>2] = $2;
 $11 = ((($4)) + 4|0);
 HEAP32[$11>>2] = $0;
 $12 = ((($4)) + 8|0);
 HEAP32[$12>>2] = $1;
 $13 = ((($4)) + 12|0);
 HEAP32[$13>>2] = $3;
 $14 = ((($4)) + 16|0);
 $15 = ((($4)) + 20|0);
 $16 = ((($4)) + 24|0);
 $17 = ((($4)) + 28|0);
 $18 = ((($4)) + 32|0);
 $19 = ((($4)) + 40|0);
 dest=$14; stop=dest+36|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));HEAP16[$14+36>>1]=0|0;HEAP8[$14+38>>0]=0|0;
 $20 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($10,$2,0)|0);
 L1: do {
  if ($20) {
   $21 = ((($4)) + 48|0);
   HEAP32[$21>>2] = 1;
   $22 = HEAP32[$10>>2]|0;
   $23 = ((($22)) + 20|0);
   $24 = HEAP32[$23>>2]|0;
   FUNCTION_TABLE_viiiiii[$24 & 31]($10,$4,$8,$8,1,0);
   $25 = HEAP32[$16>>2]|0;
   $26 = ($25|0)==(1);
   $spec$select = $26 ? $8 : 0;
   $$0 = $spec$select;
  } else {
   $27 = ((($4)) + 36|0);
   $28 = HEAP32[$10>>2]|0;
   $29 = ((($28)) + 24|0);
   $30 = HEAP32[$29>>2]|0;
   FUNCTION_TABLE_viiiii[$30 & 31]($10,$4,$8,1,0);
   $31 = HEAP32[$27>>2]|0;
   switch ($31|0) {
   case 0:  {
    $32 = HEAP32[$19>>2]|0;
    $33 = ($32|0)==(1);
    $34 = HEAP32[$17>>2]|0;
    $35 = ($34|0)==(1);
    $or$cond = $33 & $35;
    $36 = HEAP32[$18>>2]|0;
    $37 = ($36|0)==(1);
    $or$cond28 = $or$cond & $37;
    $38 = HEAP32[$15>>2]|0;
    $spec$select33 = $or$cond28 ? $38 : 0;
    $$0 = $spec$select33;
    break L1;
    break;
   }
   case 1:  {
    break;
   }
   default: {
    $$0 = 0;
    break L1;
   }
   }
   $39 = HEAP32[$16>>2]|0;
   $40 = ($39|0)==(1);
   if (!($40)) {
    $41 = HEAP32[$19>>2]|0;
    $42 = ($41|0)==(0);
    $43 = HEAP32[$17>>2]|0;
    $44 = ($43|0)==(1);
    $or$cond30 = $42 & $44;
    $45 = HEAP32[$18>>2]|0;
    $46 = ($45|0)==(1);
    $or$cond32 = $or$cond30 & $46;
    if (!($or$cond32)) {
     $$0 = 0;
     break;
    }
   }
   $47 = HEAP32[$14>>2]|0;
   $$0 = $47;
  }
 } while(0);
 STACKTOP = sp;return ($$0|0);
}
function __ZN10__cxxabiv120__si_class_type_infoD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10__cxxabiv116__shim_type_infoD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $6 = ((($1)) + 8|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$7,$5)|0);
 if ($8) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$1,$2,$3,$4);
 } else {
  $9 = ((($0)) + 8|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = HEAP32[$10>>2]|0;
  $12 = ((($11)) + 20|0);
  $13 = HEAP32[$12>>2]|0;
  FUNCTION_TABLE_viiiiii[$13 & 31]($10,$1,$2,$3,$4,$5);
 }
 return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$037$off038 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $5 = ((($1)) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$6,$4)|0);
 do {
  if ($7) {
   __ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi(0,$1,$2,$3);
  } else {
   $8 = HEAP32[$1>>2]|0;
   $9 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$8,$4)|0);
   if (!($9)) {
    $44 = ((($0)) + 8|0);
    $45 = HEAP32[$44>>2]|0;
    $46 = HEAP32[$45>>2]|0;
    $47 = ((($46)) + 24|0);
    $48 = HEAP32[$47>>2]|0;
    FUNCTION_TABLE_viiiii[$48 & 31]($45,$1,$2,$3,$4);
    break;
   }
   $10 = ((($1)) + 16|0);
   $11 = HEAP32[$10>>2]|0;
   $12 = ($11|0)==($2|0);
   if (!($12)) {
    $13 = ((($1)) + 20|0);
    $14 = HEAP32[$13>>2]|0;
    $15 = ($14|0)==($2|0);
    if (!($15)) {
     $18 = ((($1)) + 32|0);
     HEAP32[$18>>2] = $3;
     $19 = ((($1)) + 44|0);
     $20 = HEAP32[$19>>2]|0;
     $21 = ($20|0)==(4);
     if ($21) {
      break;
     }
     $22 = ((($1)) + 52|0);
     HEAP8[$22>>0] = 0;
     $23 = ((($1)) + 53|0);
     HEAP8[$23>>0] = 0;
     $24 = ((($0)) + 8|0);
     $25 = HEAP32[$24>>2]|0;
     $26 = HEAP32[$25>>2]|0;
     $27 = ((($26)) + 20|0);
     $28 = HEAP32[$27>>2]|0;
     FUNCTION_TABLE_viiiiii[$28 & 31]($25,$1,$2,$2,1,$4);
     $29 = HEAP8[$23>>0]|0;
     $30 = ($29<<24>>24)==(0);
     if ($30) {
      $$037$off038 = 0;
      label = 11;
     } else {
      $31 = HEAP8[$22>>0]|0;
      $32 = ($31<<24>>24)==(0);
      if ($32) {
       $$037$off038 = 1;
       label = 11;
      } else {
       label = 15;
      }
     }
     do {
      if ((label|0) == 11) {
       HEAP32[$13>>2] = $2;
       $33 = ((($1)) + 40|0);
       $34 = HEAP32[$33>>2]|0;
       $35 = (($34) + 1)|0;
       HEAP32[$33>>2] = $35;
       $36 = ((($1)) + 36|0);
       $37 = HEAP32[$36>>2]|0;
       $38 = ($37|0)==(1);
       if ($38) {
        $39 = ((($1)) + 24|0);
        $40 = HEAP32[$39>>2]|0;
        $41 = ($40|0)==(2);
        if ($41) {
         $42 = ((($1)) + 54|0);
         HEAP8[$42>>0] = 1;
         if ($$037$off038) {
          label = 15;
          break;
         } else {
          $43 = 4;
          break;
         }
        }
       }
       if ($$037$off038) {
        label = 15;
       } else {
        $43 = 4;
       }
      }
     } while(0);
     if ((label|0) == 15) {
      $43 = 3;
     }
     HEAP32[$19>>2] = $43;
     break;
    }
   }
   $16 = ($3|0)==(1);
   if ($16) {
    $17 = ((($1)) + 32|0);
    HEAP32[$17>>2] = 1;
   }
  }
 } while(0);
 return;
}
function __ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($1)) + 8|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$5,0)|0);
 if ($6) {
  __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$1,$2,$3);
 } else {
  $7 = ((($0)) + 8|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = HEAP32[$8>>2]|0;
  $10 = ((($9)) + 28|0);
  $11 = HEAP32[$10>>2]|0;
  FUNCTION_TABLE_viiii[$11 & 63]($8,$1,$2,$3);
 }
 return;
}
function __ZNSt9type_infoD2Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZN10__cxxabiv112_GLOBAL__N_110construct_Ev() {
 var $0 = 0, $1 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 $0 = (_pthread_key_create((8256|0),(53|0))|0);
 $1 = ($0|0)==(0);
 if ($1) {
  STACKTOP = sp;return;
 } else {
  _abort_message(6264,$vararg_buffer);
  // unreachable;
 }
}
function __ZN10__cxxabiv112_GLOBAL__N_19destruct_EPv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 _free($0);
 $1 = HEAP32[2064]|0;
 $2 = (_pthread_setspecific(($1|0),(0|0))|0);
 $3 = ($2|0)==(0);
 if ($3) {
  STACKTOP = sp;return;
 } else {
  _abort_message(6314,$vararg_buffer);
  // unreachable;
 }
}
function __ZSt9terminatev() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (___cxa_get_globals_fast()|0);
 $1 = ($0|0)==(0|0);
 if (!($1)) {
  $2 = HEAP32[$0>>2]|0;
  $3 = ($2|0)==(0|0);
  if (!($3)) {
   $4 = ((($2)) + 48|0);
   $5 = $4;
   $6 = $5;
   $7 = HEAP32[$6>>2]|0;
   $8 = (($5) + 4)|0;
   $9 = $8;
   $10 = HEAP32[$9>>2]|0;
   $11 = $7 & -256;
   $12 = ($11|0)==(1126902528);
   $13 = ($10|0)==(1129074247);
   $14 = $12 & $13;
   if ($14) {
    $15 = ((($2)) + 12|0);
    $16 = HEAP32[$15>>2]|0;
    __ZSt11__terminatePFvvE($16);
    // unreachable;
   }
  }
 }
 $17 = (__ZSt13get_terminatev()|0);
 __ZSt11__terminatePFvvE($17);
 // unreachable;
}
function __ZSt11__terminatePFvvE($0) {
 $0 = $0|0;
 var $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 FUNCTION_TABLE_v[$0 & 63]();
 _abort_message(6367,$vararg_buffer);
 // unreachable;
}
function __ZSt13get_terminatev() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[883]|0;
 $1 = (($0) + 0)|0;
 HEAP32[883] = $1;
 $2 = $0;
 return ($2|0);
}
function __ZNSt9exceptionD2Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function __ZNSt11logic_errorD2Ev($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAP32[$0>>2] = (3624);
 $1 = ((($0)) + 4|0);
 __ZNSt3__218__libcpp_refstringD2Ev($1);
 return;
}
function __ZNSt11logic_errorD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZNSt11logic_errorD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNKSt11logic_error4whatEv($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 4|0);
 $2 = (__ZNKSt3__218__libcpp_refstring5c_strEv($1)|0);
 return ($2|0);
}
function __ZNKSt3__218__libcpp_refstring5c_strEv($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[$0>>2]|0;
 return ($1|0);
}
function __ZNSt3__218__libcpp_refstringD2Ev($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZNKSt3__218__libcpp_refstring15__uses_refcountEv($0)|0);
 if ($1) {
  $2 = HEAP32[$0>>2]|0;
  $3 = (__ZNSt3__215__refstring_imp12_GLOBAL__N_113rep_from_dataEPKc_145($2)|0);
  $4 = ((($3)) + 8|0);
  $5 = HEAP32[$4>>2]|0;
  $6 = (($5) + -1)|0;
  HEAP32[$4>>2] = $6;
  $7 = (($5) + -1)|0;
  $8 = ($7|0)<(0);
  if ($8) {
   __ZdlPv($3);
  }
 }
 return;
}
function __ZNSt3__215__refstring_imp12_GLOBAL__N_113rep_from_dataEPKc_145($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + -12|0);
 return ($1|0);
}
function __ZNSt12length_errorD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZNSt11logic_errorD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZN10__cxxabiv123__fundamental_type_infoD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10__cxxabiv116__shim_type_infoD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$1,0)|0);
 return ($3|0);
}
function __ZN10__cxxabiv119__pointer_type_infoD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10__cxxabiv116__shim_type_infoD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $$4 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $5 = 0;
 var $6 = 0, $7 = 0, $8 = 0, $9 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $3 = sp;
 $4 = HEAP32[$2>>2]|0;
 $5 = HEAP32[$4>>2]|0;
 HEAP32[$2>>2] = $5;
 $6 = (__ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv($0,$1,0)|0);
 if ($6) {
  $$4 = 1;
 } else {
  $7 = ($1|0)==(0|0);
  if ($7) {
   $$4 = 0;
  } else {
   $8 = (___dynamic_cast($1,2736,2824,0)|0);
   $9 = ($8|0)==(0|0);
   if ($9) {
    $$4 = 0;
   } else {
    $10 = ((($8)) + 8|0);
    $11 = HEAP32[$10>>2]|0;
    $12 = ((($0)) + 8|0);
    $13 = HEAP32[$12>>2]|0;
    $14 = $13 ^ -1;
    $15 = $11 & $14;
    $16 = ($15|0)==(0);
    if ($16) {
     $17 = ((($0)) + 12|0);
     $18 = HEAP32[$17>>2]|0;
     $19 = ((($8)) + 12|0);
     $20 = HEAP32[$19>>2]|0;
     $21 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($18,$20,0)|0);
     if ($21) {
      $$4 = 1;
     } else {
      $22 = HEAP32[$17>>2]|0;
      $23 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($22,2856,0)|0);
      if ($23) {
       $$4 = 1;
      } else {
       $24 = HEAP32[$17>>2]|0;
       $25 = ($24|0)==(0|0);
       if ($25) {
        $$4 = 0;
       } else {
        $26 = (___dynamic_cast($24,2736,2720,0)|0);
        $27 = ($26|0)==(0|0);
        if ($27) {
         $$4 = 0;
        } else {
         $28 = HEAP32[$19>>2]|0;
         $29 = ($28|0)==(0|0);
         if ($29) {
          $$4 = 0;
         } else {
          $30 = (___dynamic_cast($28,2736,2720,0)|0);
          $31 = ($30|0)==(0|0);
          if ($31) {
           $$4 = 0;
          } else {
           $32 = ((($3)) + 4|0);
           dest=$32; stop=dest+52|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
           HEAP32[$3>>2] = $30;
           $33 = ((($3)) + 8|0);
           HEAP32[$33>>2] = $26;
           $34 = ((($3)) + 12|0);
           HEAP32[$34>>2] = -1;
           $35 = ((($3)) + 48|0);
           HEAP32[$35>>2] = 1;
           $36 = HEAP32[$30>>2]|0;
           $37 = ((($36)) + 28|0);
           $38 = HEAP32[$37>>2]|0;
           $39 = HEAP32[$2>>2]|0;
           FUNCTION_TABLE_viiii[$38 & 63]($30,$3,$39,1);
           $40 = ((($3)) + 24|0);
           $41 = HEAP32[$40>>2]|0;
           $42 = ($41|0)==(1);
           if ($42) {
            $43 = ((($3)) + 16|0);
            $44 = HEAP32[$43>>2]|0;
            HEAP32[$2>>2] = $44;
            $$0 = 1;
           } else {
            $$0 = 0;
           }
           $$4 = $$0;
          }
         }
        }
       }
      }
     }
    } else {
     $$4 = 0;
    }
   }
  }
 }
 STACKTOP = sp;return ($$4|0);
}
function __ZNK10__cxxabiv117__pbase_type_info9can_catchEPKNS_16__shim_type_infoERPv($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$1,0)|0);
 if ($3) {
  $$0 = 1;
 } else {
  $4 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($1,2864,0)|0);
  $$0 = $4;
 }
 return ($$0|0);
}
function __ZN10__cxxabiv121__vmi_class_type_infoD0Ev($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10__cxxabiv116__shim_type_infoD2Ev($0);
 __ZdlPv($0);
 return;
}
function __ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $6 = ((($1)) + 8|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$7,$5)|0);
 if ($8) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$1,$2,$3,$4);
 } else {
  $9 = ((($1)) + 52|0);
  $10 = HEAP8[$9>>0]|0;
  $11 = ((($1)) + 53|0);
  $12 = HEAP8[$11>>0]|0;
  $13 = ((($0)) + 16|0);
  $14 = ((($0)) + 12|0);
  $15 = HEAP32[$14>>2]|0;
  $16 = (((($0)) + 16|0) + ($15<<3)|0);
  HEAP8[$9>>0] = 0;
  HEAP8[$11>>0] = 0;
  __ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($13,$1,$2,$3,$4,$5);
  $17 = ($15|0)>(1);
  L4: do {
   if ($17) {
    $18 = ((($0)) + 24|0);
    $19 = ((($1)) + 24|0);
    $20 = ((($0)) + 8|0);
    $21 = ((($1)) + 54|0);
    $$0 = $18;
    while(1) {
     $22 = HEAP8[$21>>0]|0;
     $23 = ($22<<24>>24)==(0);
     if (!($23)) {
      break L4;
     }
     $24 = HEAP8[$9>>0]|0;
     $25 = ($24<<24>>24)==(0);
     if ($25) {
      $31 = HEAP8[$11>>0]|0;
      $32 = ($31<<24>>24)==(0);
      if (!($32)) {
       $33 = HEAP32[$20>>2]|0;
       $34 = $33 & 1;
       $35 = ($34|0)==(0);
       if ($35) {
        break L4;
       }
      }
     } else {
      $26 = HEAP32[$19>>2]|0;
      $27 = ($26|0)==(1);
      if ($27) {
       break L4;
      }
      $28 = HEAP32[$20>>2]|0;
      $29 = $28 & 2;
      $30 = ($29|0)==(0);
      if ($30) {
       break L4;
      }
     }
     HEAP8[$9>>0] = 0;
     HEAP8[$11>>0] = 0;
     __ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($$0,$1,$2,$3,$4,$5);
     $36 = ((($$0)) + 8|0);
     $37 = ($36>>>0)<($16>>>0);
     if ($37) {
      $$0 = $36;
     } else {
      break;
     }
    }
   }
  } while(0);
  HEAP8[$9>>0] = $10;
  HEAP8[$11>>0] = $12;
 }
 return;
}
function __ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$0 = 0, $$081$off0 = 0, $$084 = 0, $$085$off0 = 0, $$1 = 0, $$182$off0 = 0, $$186$off0 = 0, $$2 = 0, $$283$off0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0;
 var $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0;
 var $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $5 = ((($1)) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$6,$4)|0);
 L1: do {
  if ($7) {
   __ZNK10__cxxabiv117__class_type_info29process_static_type_below_dstEPNS_19__dynamic_cast_infoEPKvi(0,$1,$2,$3);
  } else {
   $8 = HEAP32[$1>>2]|0;
   $9 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$8,$4)|0);
   if (!($9)) {
    $56 = ((($0)) + 16|0);
    $57 = ((($0)) + 12|0);
    $58 = HEAP32[$57>>2]|0;
    $59 = (((($0)) + 16|0) + ($58<<3)|0);
    __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($56,$1,$2,$3,$4);
    $60 = ((($0)) + 24|0);
    $61 = ($58|0)>(1);
    if (!($61)) {
     break;
    }
    $62 = ((($0)) + 8|0);
    $63 = HEAP32[$62>>2]|0;
    $64 = $63 & 2;
    $65 = ($64|0)==(0);
    if ($65) {
     $66 = ((($1)) + 36|0);
     $67 = HEAP32[$66>>2]|0;
     $68 = ($67|0)==(1);
     if (!($68)) {
      $74 = $63 & 1;
      $75 = ($74|0)==(0);
      if ($75) {
       $86 = ((($1)) + 54|0);
       $$2 = $60;
       while(1) {
        $87 = HEAP8[$86>>0]|0;
        $88 = ($87<<24>>24)==(0);
        if (!($88)) {
         break L1;
        }
        $89 = HEAP32[$66>>2]|0;
        $90 = ($89|0)==(1);
        if ($90) {
         break L1;
        }
        __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($$2,$1,$2,$3,$4);
        $91 = ((($$2)) + 8|0);
        $92 = ($91>>>0)<($59>>>0);
        if ($92) {
         $$2 = $91;
        } else {
         break L1;
        }
       }
      }
      $76 = ((($1)) + 24|0);
      $77 = ((($1)) + 54|0);
      $$1 = $60;
      while(1) {
       $78 = HEAP8[$77>>0]|0;
       $79 = ($78<<24>>24)==(0);
       if (!($79)) {
        break L1;
       }
       $80 = HEAP32[$66>>2]|0;
       $81 = ($80|0)==(1);
       if ($81) {
        $82 = HEAP32[$76>>2]|0;
        $83 = ($82|0)==(1);
        if ($83) {
         break L1;
        }
       }
       __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($$1,$1,$2,$3,$4);
       $84 = ((($$1)) + 8|0);
       $85 = ($84>>>0)<($59>>>0);
       if ($85) {
        $$1 = $84;
       } else {
        break L1;
       }
      }
     }
    }
    $69 = ((($1)) + 54|0);
    $$0 = $60;
    while(1) {
     $70 = HEAP8[$69>>0]|0;
     $71 = ($70<<24>>24)==(0);
     if (!($71)) {
      break L1;
     }
     __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($$0,$1,$2,$3,$4);
     $72 = ((($$0)) + 8|0);
     $73 = ($72>>>0)<($59>>>0);
     if ($73) {
      $$0 = $72;
     } else {
      break L1;
     }
    }
   }
   $10 = ((($1)) + 16|0);
   $11 = HEAP32[$10>>2]|0;
   $12 = ($11|0)==($2|0);
   if (!($12)) {
    $13 = ((($1)) + 20|0);
    $14 = HEAP32[$13>>2]|0;
    $15 = ($14|0)==($2|0);
    if (!($15)) {
     $18 = ((($1)) + 32|0);
     HEAP32[$18>>2] = $3;
     $19 = ((($1)) + 44|0);
     $20 = HEAP32[$19>>2]|0;
     $21 = ($20|0)==(4);
     if ($21) {
      break;
     }
     $22 = ((($0)) + 16|0);
     $23 = ((($0)) + 12|0);
     $24 = HEAP32[$23>>2]|0;
     $25 = (((($0)) + 16|0) + ($24<<3)|0);
     $26 = ((($1)) + 52|0);
     $27 = ((($1)) + 53|0);
     $28 = ((($1)) + 54|0);
     $29 = ((($0)) + 8|0);
     $30 = ((($1)) + 24|0);
     $$081$off0 = 0;$$084 = $22;$$085$off0 = 0;
     L32: while(1) {
      $31 = ($$084>>>0)<($25>>>0);
      if (!($31)) {
       $$283$off0 = $$081$off0;
       label = 18;
       break;
      }
      HEAP8[$26>>0] = 0;
      HEAP8[$27>>0] = 0;
      __ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($$084,$1,$2,$2,1,$4);
      $32 = HEAP8[$28>>0]|0;
      $33 = ($32<<24>>24)==(0);
      if (!($33)) {
       $$283$off0 = $$081$off0;
       label = 18;
       break;
      }
      $34 = HEAP8[$27>>0]|0;
      $35 = ($34<<24>>24)==(0);
      do {
       if ($35) {
        $$182$off0 = $$081$off0;$$186$off0 = $$085$off0;
       } else {
        $36 = HEAP8[$26>>0]|0;
        $37 = ($36<<24>>24)==(0);
        if ($37) {
         $43 = HEAP32[$29>>2]|0;
         $44 = $43 & 1;
         $45 = ($44|0)==(0);
         if ($45) {
          $$283$off0 = 1;
          label = 18;
          break L32;
         } else {
          $$182$off0 = 1;$$186$off0 = $$085$off0;
          break;
         }
        }
        $38 = HEAP32[$30>>2]|0;
        $39 = ($38|0)==(1);
        if ($39) {
         label = 23;
         break L32;
        }
        $40 = HEAP32[$29>>2]|0;
        $41 = $40 & 2;
        $42 = ($41|0)==(0);
        if ($42) {
         label = 23;
         break L32;
        } else {
         $$182$off0 = 1;$$186$off0 = 1;
        }
       }
      } while(0);
      $46 = ((($$084)) + 8|0);
      $$081$off0 = $$182$off0;$$084 = $46;$$085$off0 = $$186$off0;
     }
     do {
      if ((label|0) == 18) {
       if (!($$085$off0)) {
        HEAP32[$13>>2] = $2;
        $47 = ((($1)) + 40|0);
        $48 = HEAP32[$47>>2]|0;
        $49 = (($48) + 1)|0;
        HEAP32[$47>>2] = $49;
        $50 = ((($1)) + 36|0);
        $51 = HEAP32[$50>>2]|0;
        $52 = ($51|0)==(1);
        if ($52) {
         $53 = HEAP32[$30>>2]|0;
         $54 = ($53|0)==(2);
         if ($54) {
          HEAP8[$28>>0] = 1;
          if ($$283$off0) {
           label = 23;
           break;
          } else {
           $55 = 4;
           break;
          }
         }
        }
       }
       if ($$283$off0) {
        label = 23;
       } else {
        $55 = 4;
       }
      }
     } while(0);
     if ((label|0) == 23) {
      $55 = 3;
     }
     HEAP32[$19>>2] = $55;
     break;
    }
   }
   $16 = ($3|0)==(1);
   if ($16) {
    $17 = ((($1)) + 32|0);
    HEAP32[$17>>2] = 1;
   }
  }
 } while(0);
 return;
}
function __ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($1)) + 8|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = (__ZN10__cxxabiv18is_equalEPKSt9type_infoS2_b($0,$5,0)|0);
 L1: do {
  if ($6) {
   __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$1,$2,$3);
  } else {
   $7 = ((($0)) + 16|0);
   $8 = ((($0)) + 12|0);
   $9 = HEAP32[$8>>2]|0;
   $10 = (((($0)) + 16|0) + ($9<<3)|0);
   __ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($7,$1,$2,$3);
   $11 = ($9|0)>(1);
   if ($11) {
    $12 = ((($0)) + 24|0);
    $13 = ((($1)) + 54|0);
    $$0 = $12;
    while(1) {
     __ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($$0,$1,$2,$3);
     $14 = HEAP8[$13>>0]|0;
     $15 = ($14<<24>>24)==(0);
     if (!($15)) {
      break L1;
     }
     $16 = ((($$0)) + 8|0);
     $17 = ($16>>>0)<($10>>>0);
     if ($17) {
      $$0 = $16;
     } else {
      break;
     }
    }
   }
  }
 } while(0);
 return;
}
function __ZNK10__cxxabiv122__base_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $4 = ((($0)) + 4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $5 >> 8;
 $7 = $5 & 1;
 $8 = ($7|0)==(0);
 if ($8) {
  $$0 = $6;
 } else {
  $9 = HEAP32[$2>>2]|0;
  $10 = (($9) + ($6)|0);
  $11 = HEAP32[$10>>2]|0;
  $$0 = $11;
 }
 $12 = HEAP32[$0>>2]|0;
 $13 = HEAP32[$12>>2]|0;
 $14 = ((($13)) + 28|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (($2) + ($$0)|0);
 $17 = $5 & 2;
 $18 = ($17|0)==(0);
 $19 = $18 ? 2 : $3;
 FUNCTION_TABLE_viiii[$15 & 63]($12,$1,$16,$19);
 return;
}
function __ZNK10__cxxabiv122__base_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $6 = ((($0)) + 4|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = $7 >> 8;
 $9 = $7 & 1;
 $10 = ($9|0)==(0);
 if ($10) {
  $$0 = $8;
 } else {
  $11 = HEAP32[$3>>2]|0;
  $12 = (($11) + ($8)|0);
  $13 = HEAP32[$12>>2]|0;
  $$0 = $13;
 }
 $14 = HEAP32[$0>>2]|0;
 $15 = HEAP32[$14>>2]|0;
 $16 = ((($15)) + 20|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = (($3) + ($$0)|0);
 $19 = $7 & 2;
 $20 = ($19|0)==(0);
 $21 = $20 ? 2 : $4;
 FUNCTION_TABLE_viiiiii[$17 & 31]($14,$1,$2,$18,$21,$5);
 return;
}
function __ZNK10__cxxabiv122__base_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $5 = ((($0)) + 4|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = $6 >> 8;
 $8 = $6 & 1;
 $9 = ($8|0)==(0);
 if ($9) {
  $$0 = $7;
 } else {
  $10 = HEAP32[$2>>2]|0;
  $11 = (($10) + ($7)|0);
  $12 = HEAP32[$11>>2]|0;
  $$0 = $12;
 }
 $13 = HEAP32[$0>>2]|0;
 $14 = HEAP32[$13>>2]|0;
 $15 = ((($14)) + 24|0);
 $16 = HEAP32[$15>>2]|0;
 $17 = (($2) + ($$0)|0);
 $18 = $6 & 2;
 $19 = ($18|0)==(0);
 $20 = $19 ? 2 : $3;
 FUNCTION_TABLE_viiiii[$16 & 31]($13,$1,$17,$20,$4);
 return;
}
function __ZSt15get_new_handlerv() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[2065]|0;
 $1 = (($0) + 0)|0;
 HEAP32[2065] = $1;
 $2 = $0;
 return ($2|0);
}
function ___cxa_can_catch($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = sp;
 $4 = HEAP32[$2>>2]|0;
 HEAP32[$3>>2] = $4;
 $5 = HEAP32[$0>>2]|0;
 $6 = ((($5)) + 16|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (FUNCTION_TABLE_iiii[$7 & 63]($0,$1,$3)|0);
 $9 = $8&1;
 if ($8) {
  $10 = HEAP32[$3>>2]|0;
  HEAP32[$2>>2] = $10;
 }
 STACKTOP = sp;return ($9|0);
}
function ___cxa_is_pointer_type($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $phitmp = 0, $phitmp1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0|0);
 if ($1) {
  $3 = 0;
 } else {
  $2 = (___dynamic_cast($0,2736,2824,0)|0);
  $phitmp = ($2|0)!=(0|0);
  $phitmp1 = $phitmp&1;
  $3 = $phitmp1;
 }
 return ($3|0);
}
function ___muldsi3($a, $b) {
    $a = $a | 0;
    $b = $b | 0;
    var $1 = 0, $2 = 0, $3 = 0, $6 = 0, $8 = 0, $11 = 0, $12 = 0;
    $1 = $a & 65535;
    $2 = $b & 65535;
    $3 = Math_imul($2, $1) | 0;
    $6 = $a >>> 16;
    $8 = ($3 >>> 16) + (Math_imul($2, $6) | 0) | 0;
    $11 = $b >>> 16;
    $12 = Math_imul($11, $1) | 0;
    return (setTempRet0(((($8 >>> 16) + (Math_imul($11, $6) | 0) | 0) + ((($8 & 65535) + $12 | 0) >>> 16) | 0) | 0), 0 | ($8 + $12 << 16 | $3 & 65535)) | 0;
}
function ___muldi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $x_sroa_0_0_extract_trunc = 0, $y_sroa_0_0_extract_trunc = 0, $1$0 = 0, $1$1 = 0, $2 = 0;
    $x_sroa_0_0_extract_trunc = $a$0;
    $y_sroa_0_0_extract_trunc = $b$0;
    $1$0 = ___muldsi3($x_sroa_0_0_extract_trunc, $y_sroa_0_0_extract_trunc) | 0;
    $1$1 = (getTempRet0() | 0);
    $2 = Math_imul($a$1, $y_sroa_0_0_extract_trunc) | 0;
    return (setTempRet0((((Math_imul($b$1, $x_sroa_0_0_extract_trunc) | 0) + $2 | 0) + $1$1 | $1$1 & 0) | 0), 0 | $1$0 & -1) | 0;
}
function _i64Add(a, b, c, d) {
    /*
      x = a + b*2^32
      y = c + d*2^32
      result = l + h*2^32
    */
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a + c)>>>0;
    h = (b + d + (((l>>>0) < (a>>>0))|0))>>>0; // Add carry from low word to high word on overflow.
    return ((setTempRet0((h) | 0),l|0)|0);
}
function _i64Subtract(a, b, c, d) {
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a - c)>>>0;
    h = (b - d)>>>0;
    h = (b - d - (((c>>>0) > (a>>>0))|0))>>>0; // Borrow one from high word to low word on underflow.
    return ((setTempRet0((h) | 0),l|0)|0);
}
function _llvm_cttz_i32(x) { // Note: Currently doesn't take isZeroUndef()
    x = x | 0;
    return (x ? (31 - (Math_clz32((x ^ (x - 1))) | 0) | 0) : 32) | 0;
}
function ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    $rem = $rem | 0;
    var $n_sroa_0_0_extract_trunc = 0, $n_sroa_1_4_extract_shift$0 = 0, $n_sroa_1_4_extract_trunc = 0, $d_sroa_0_0_extract_trunc = 0, $d_sroa_1_4_extract_shift$0 = 0, $d_sroa_1_4_extract_trunc = 0, $4 = 0, $17 = 0, $37 = 0, $49 = 0, $51 = 0, $57 = 0, $58 = 0, $66 = 0, $78 = 0, $86 = 0, $88 = 0, $89 = 0, $91 = 0, $92 = 0, $95 = 0, $105 = 0, $117 = 0, $119 = 0, $125 = 0, $126 = 0, $130 = 0, $q_sroa_1_1_ph = 0, $q_sroa_0_1_ph = 0, $r_sroa_1_1_ph = 0, $r_sroa_0_1_ph = 0, $sr_1_ph = 0, $d_sroa_0_0_insert_insert99$0 = 0, $d_sroa_0_0_insert_insert99$1 = 0, $137$0 = 0, $137$1 = 0, $carry_0203 = 0, $sr_1202 = 0, $r_sroa_0_1201 = 0, $r_sroa_1_1200 = 0, $q_sroa_0_1199 = 0, $q_sroa_1_1198 = 0, $147 = 0, $149 = 0, $r_sroa_0_0_insert_insert42$0 = 0, $r_sroa_0_0_insert_insert42$1 = 0, $150$1 = 0, $151$0 = 0, $152 = 0, $154$0 = 0, $r_sroa_0_0_extract_trunc = 0, $r_sroa_1_4_extract_trunc = 0, $155 = 0, $carry_0_lcssa$0 = 0, $carry_0_lcssa$1 = 0, $r_sroa_0_1_lcssa = 0, $r_sroa_1_1_lcssa = 0, $q_sroa_0_1_lcssa = 0, $q_sroa_1_1_lcssa = 0, $q_sroa_0_0_insert_ext75$0 = 0, $q_sroa_0_0_insert_ext75$1 = 0, $q_sroa_0_0_insert_insert77$1 = 0, $_0$0 = 0, $_0$1 = 0;
    $n_sroa_0_0_extract_trunc = $a$0;
    $n_sroa_1_4_extract_shift$0 = $a$1;
    $n_sroa_1_4_extract_trunc = $n_sroa_1_4_extract_shift$0;
    $d_sroa_0_0_extract_trunc = $b$0;
    $d_sroa_1_4_extract_shift$0 = $b$1;
    $d_sroa_1_4_extract_trunc = $d_sroa_1_4_extract_shift$0;
    if (($n_sroa_1_4_extract_trunc | 0) == 0) {
      $4 = ($rem | 0) != 0;
      if (($d_sroa_1_4_extract_trunc | 0) == 0) {
        if ($4) {
          HEAP32[$rem >> 2] = ($n_sroa_0_0_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
          HEAP32[$rem + 4 >> 2] = 0;
        }
        $_0$1 = 0;
        $_0$0 = ($n_sroa_0_0_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
        return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
      } else {
        if (!$4) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
      }
    }
    $17 = ($d_sroa_1_4_extract_trunc | 0) == 0;
    do {
      if (($d_sroa_0_0_extract_trunc | 0) == 0) {
        if ($17) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
            HEAP32[$rem + 4 >> 2] = 0;
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        if (($n_sroa_0_0_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0;
            HEAP32[$rem + 4 >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_1_4_extract_trunc >>> 0);
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_1_4_extract_trunc >>> 0) >>> 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        $37 = $d_sroa_1_4_extract_trunc - 1 | 0;
        if (($37 & $d_sroa_1_4_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0 | $a$0 & -1;
            HEAP32[$rem + 4 >> 2] = $37 & $n_sroa_1_4_extract_trunc | $a$1 & 0;
          }
          $_0$1 = 0;
          $_0$0 = $n_sroa_1_4_extract_trunc >>> ((_llvm_cttz_i32($d_sroa_1_4_extract_trunc | 0) | 0) >>> 0);
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        $49 = Math_clz32($d_sroa_1_4_extract_trunc | 0) | 0;
        $51 = $49 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
        if ($51 >>> 0 <= 30) {
          $57 = $51 + 1 | 0;
          $58 = 31 - $51 | 0;
          $sr_1_ph = $57;
          $r_sroa_0_1_ph = $n_sroa_1_4_extract_trunc << $58 | $n_sroa_0_0_extract_trunc >>> ($57 >>> 0);
          $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($57 >>> 0);
          $q_sroa_0_1_ph = 0;
          $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $58;
          break;
        }
        if (($rem | 0) == 0) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = 0 | $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
      } else {
        if (!$17) {
          $117 = Math_clz32($d_sroa_1_4_extract_trunc | 0) | 0;
          $119 = $117 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          if ($119 >>> 0 <= 31) {
            $125 = $119 + 1 | 0;
            $126 = 31 - $119 | 0;
            $130 = $119 - 31 >> 31;
            $sr_1_ph = $125;
            $r_sroa_0_1_ph = $n_sroa_0_0_extract_trunc >>> ($125 >>> 0) & $130 | $n_sroa_1_4_extract_trunc << $126;
            $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($125 >>> 0) & $130;
            $q_sroa_0_1_ph = 0;
            $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $126;
            break;
          }
          if (($rem | 0) == 0) {
            $_0$1 = 0;
            $_0$0 = 0;
            return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
          }
          HEAP32[$rem >> 2] = 0 | $a$0 & -1;
          HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$1 = 0;
          $_0$0 = 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
        $66 = $d_sroa_0_0_extract_trunc - 1 | 0;
        if (($66 & $d_sroa_0_0_extract_trunc | 0) != 0) {
          $86 = (Math_clz32($d_sroa_0_0_extract_trunc | 0) | 0) + 33 | 0;
          $88 = $86 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          $89 = 64 - $88 | 0;
          $91 = 32 - $88 | 0;
          $92 = $91 >> 31;
          $95 = $88 - 32 | 0;
          $105 = $95 >> 31;
          $sr_1_ph = $88;
          $r_sroa_0_1_ph = $91 - 1 >> 31 & $n_sroa_1_4_extract_trunc >>> ($95 >>> 0) | ($n_sroa_1_4_extract_trunc << $91 | $n_sroa_0_0_extract_trunc >>> ($88 >>> 0)) & $105;
          $r_sroa_1_1_ph = $105 & $n_sroa_1_4_extract_trunc >>> ($88 >>> 0);
          $q_sroa_0_1_ph = $n_sroa_0_0_extract_trunc << $89 & $92;
          $q_sroa_1_1_ph = ($n_sroa_1_4_extract_trunc << $89 | $n_sroa_0_0_extract_trunc >>> ($95 >>> 0)) & $92 | $n_sroa_0_0_extract_trunc << $91 & $88 - 33 >> 31;
          break;
        }
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = $66 & $n_sroa_0_0_extract_trunc;
          HEAP32[$rem + 4 >> 2] = 0;
        }
        if (($d_sroa_0_0_extract_trunc | 0) == 1) {
          $_0$1 = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$0 = 0 | $a$0 & -1;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        } else {
          $78 = _llvm_cttz_i32($d_sroa_0_0_extract_trunc | 0) | 0;
          $_0$1 = 0 | $n_sroa_1_4_extract_trunc >>> ($78 >>> 0);
          $_0$0 = $n_sroa_1_4_extract_trunc << 32 - $78 | $n_sroa_0_0_extract_trunc >>> ($78 >>> 0) | 0;
          return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
        }
      }
    } while (0);
    if (($sr_1_ph | 0) == 0) {
      $q_sroa_1_1_lcssa = $q_sroa_1_1_ph;
      $q_sroa_0_1_lcssa = $q_sroa_0_1_ph;
      $r_sroa_1_1_lcssa = $r_sroa_1_1_ph;
      $r_sroa_0_1_lcssa = $r_sroa_0_1_ph;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = 0;
    } else {
      $d_sroa_0_0_insert_insert99$0 = 0 | $b$0 & -1;
      $d_sroa_0_0_insert_insert99$1 = $d_sroa_1_4_extract_shift$0 | $b$1 & 0;
      $137$0 = _i64Add($d_sroa_0_0_insert_insert99$0 | 0, $d_sroa_0_0_insert_insert99$1 | 0, -1, -1) | 0;
      $137$1 = (getTempRet0() | 0);
      $q_sroa_1_1198 = $q_sroa_1_1_ph;
      $q_sroa_0_1199 = $q_sroa_0_1_ph;
      $r_sroa_1_1200 = $r_sroa_1_1_ph;
      $r_sroa_0_1201 = $r_sroa_0_1_ph;
      $sr_1202 = $sr_1_ph;
      $carry_0203 = 0;
      while (1) {
        $147 = $q_sroa_0_1199 >>> 31 | $q_sroa_1_1198 << 1;
        $149 = $carry_0203 | $q_sroa_0_1199 << 1;
        $r_sroa_0_0_insert_insert42$0 = 0 | ($r_sroa_0_1201 << 1 | $q_sroa_1_1198 >>> 31);
        $r_sroa_0_0_insert_insert42$1 = $r_sroa_0_1201 >>> 31 | $r_sroa_1_1200 << 1 | 0;
        _i64Subtract($137$0 | 0, $137$1 | 0, $r_sroa_0_0_insert_insert42$0 | 0, $r_sroa_0_0_insert_insert42$1 | 0) | 0;
        $150$1 = (getTempRet0() | 0);
        $151$0 = $150$1 >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1;
        $152 = $151$0 & 1;
        $154$0 = _i64Subtract($r_sroa_0_0_insert_insert42$0 | 0, $r_sroa_0_0_insert_insert42$1 | 0, $151$0 & $d_sroa_0_0_insert_insert99$0 | 0, ((($150$1 | 0) < 0 ? -1 : 0) >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1) & $d_sroa_0_0_insert_insert99$1 | 0) | 0;
        $r_sroa_0_0_extract_trunc = $154$0;
        $r_sroa_1_4_extract_trunc = (getTempRet0() | 0);
        $155 = $sr_1202 - 1 | 0;
        if (($155 | 0) == 0) {
          break;
        } else {
          $q_sroa_1_1198 = $147;
          $q_sroa_0_1199 = $149;
          $r_sroa_1_1200 = $r_sroa_1_4_extract_trunc;
          $r_sroa_0_1201 = $r_sroa_0_0_extract_trunc;
          $sr_1202 = $155;
          $carry_0203 = $152;
        }
      }
      $q_sroa_1_1_lcssa = $147;
      $q_sroa_0_1_lcssa = $149;
      $r_sroa_1_1_lcssa = $r_sroa_1_4_extract_trunc;
      $r_sroa_0_1_lcssa = $r_sroa_0_0_extract_trunc;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = $152;
    }
    $q_sroa_0_0_insert_ext75$0 = $q_sroa_0_1_lcssa;
    $q_sroa_0_0_insert_ext75$1 = 0;
    $q_sroa_0_0_insert_insert77$1 = $q_sroa_1_1_lcssa | $q_sroa_0_0_insert_ext75$1;
    if (($rem | 0) != 0) {
      HEAP32[$rem >> 2] = 0 | $r_sroa_0_1_lcssa;
      HEAP32[$rem + 4 >> 2] = $r_sroa_1_1_lcssa | 0;
    }
    $_0$1 = (0 | $q_sroa_0_0_insert_ext75$0) >>> 31 | $q_sroa_0_0_insert_insert77$1 << 1 | ($q_sroa_0_0_insert_ext75$1 << 1 | $q_sroa_0_0_insert_ext75$0 >>> 31) & 0 | $carry_0_lcssa$1;
    $_0$0 = ($q_sroa_0_0_insert_ext75$0 << 1 | 0 >>> 31) & -2 | $carry_0_lcssa$0;
    return (setTempRet0(($_0$1) | 0), $_0$0) | 0;
}
function ___udivdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $1$0 = 0;
    $1$0 = ___udivmoddi4($a$0, $a$1, $b$0, $b$1, 0) | 0;
    return $1$0 | 0;
}
function _bitshift64Lshr(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      setTempRet0((high >>> bits) | 0);
      return (low >>> bits) | ((high&ander) << (32 - bits));
    }
    setTempRet0((0) | 0);
    return (high >>> (bits - 32))|0;
}
function _bitshift64Shl(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      setTempRet0(((high << bits) | ((low&(ander << (32 - bits))) >>> (32 - bits))) | 0);
      return low << bits;
    }
    setTempRet0((low << (bits - 32)) | 0);
    return 0;
}
function _llvm_bswap_i32(x) {
    x = x|0;
    return (((x&0xff)<<24) | (((x>>8)&0xff)<<16) | (((x>>16)&0xff)<<8) | (x>>>24))|0;
}
function _memcpy(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    var aligned_dest_end = 0;
    var block_aligned_dest_end = 0;
    var dest_end = 0;
    // Test against a benchmarked cutoff limit for when HEAPU8.set() becomes faster to use.
    if ((num|0) >=
      8192
    ) {
      _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
      return dest|0;
    }

    ret = dest|0;
    dest_end = (dest + num)|0;
    if ((dest&3) == (src&3)) {
      // The initial unaligned < 4-byte front.
      while (dest & 3) {
        if ((num|0) == 0) return ret|0;
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      aligned_dest_end = (dest_end & -4)|0;
      block_aligned_dest_end = (aligned_dest_end - 64)|0;
      while ((dest|0) <= (block_aligned_dest_end|0) ) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        HEAP32[(((dest)+(4))>>2)]=((HEAP32[(((src)+(4))>>2)])|0);
        HEAP32[(((dest)+(8))>>2)]=((HEAP32[(((src)+(8))>>2)])|0);
        HEAP32[(((dest)+(12))>>2)]=((HEAP32[(((src)+(12))>>2)])|0);
        HEAP32[(((dest)+(16))>>2)]=((HEAP32[(((src)+(16))>>2)])|0);
        HEAP32[(((dest)+(20))>>2)]=((HEAP32[(((src)+(20))>>2)])|0);
        HEAP32[(((dest)+(24))>>2)]=((HEAP32[(((src)+(24))>>2)])|0);
        HEAP32[(((dest)+(28))>>2)]=((HEAP32[(((src)+(28))>>2)])|0);
        HEAP32[(((dest)+(32))>>2)]=((HEAP32[(((src)+(32))>>2)])|0);
        HEAP32[(((dest)+(36))>>2)]=((HEAP32[(((src)+(36))>>2)])|0);
        HEAP32[(((dest)+(40))>>2)]=((HEAP32[(((src)+(40))>>2)])|0);
        HEAP32[(((dest)+(44))>>2)]=((HEAP32[(((src)+(44))>>2)])|0);
        HEAP32[(((dest)+(48))>>2)]=((HEAP32[(((src)+(48))>>2)])|0);
        HEAP32[(((dest)+(52))>>2)]=((HEAP32[(((src)+(52))>>2)])|0);
        HEAP32[(((dest)+(56))>>2)]=((HEAP32[(((src)+(56))>>2)])|0);
        HEAP32[(((dest)+(60))>>2)]=((HEAP32[(((src)+(60))>>2)])|0);
        dest = (dest+64)|0;
        src = (src+64)|0;
      }
      while ((dest|0) < (aligned_dest_end|0) ) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
      }
    } else {
      // In the unaligned copy case, unroll a bit as well.
      aligned_dest_end = (dest_end - 4)|0;
      while ((dest|0) < (aligned_dest_end|0) ) {
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        HEAP8[(((dest)+(1))>>0)]=((HEAP8[(((src)+(1))>>0)])|0);
        HEAP8[(((dest)+(2))>>0)]=((HEAP8[(((src)+(2))>>0)])|0);
        HEAP8[(((dest)+(3))>>0)]=((HEAP8[(((src)+(3))>>0)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
      }
    }
    // The remaining unaligned < 4 byte tail.
    while ((dest|0) < (dest_end|0)) {
      HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
      dest = (dest+1)|0;
      src = (src+1)|0;
    }
    return ret|0;
}
function _memmove(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    if (((src|0) < (dest|0)) & ((dest|0) < ((src + num)|0))) {
      // Unlikely case: Copy backwards in a safe manner
      ret = dest;
      src = (src + num)|0;
      dest = (dest + num)|0;
      while ((num|0) > 0) {
        dest = (dest - 1)|0;
        src = (src - 1)|0;
        num = (num - 1)|0;
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
      }
      dest = ret;
    } else {
      _memcpy(dest, src, num) | 0;
    }
    return dest | 0;
}
function _memset(ptr, value, num) {
    ptr = ptr|0; value = value|0; num = num|0;
    var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
    end = (ptr + num)|0;

    value = value & 0xff;
    if ((num|0) >= 67 /* 64 bytes for an unrolled loop + 3 bytes for unaligned head*/) {
      while ((ptr&3) != 0) {
        HEAP8[((ptr)>>0)]=value;
        ptr = (ptr+1)|0;
      }

      aligned_end = (end & -4)|0;
      block_aligned_end = (aligned_end - 64)|0;
      value4 = value | (value << 8) | (value << 16) | (value << 24);

      while((ptr|0) <= (block_aligned_end|0)) {
        HEAP32[((ptr)>>2)]=value4;
        HEAP32[(((ptr)+(4))>>2)]=value4;
        HEAP32[(((ptr)+(8))>>2)]=value4;
        HEAP32[(((ptr)+(12))>>2)]=value4;
        HEAP32[(((ptr)+(16))>>2)]=value4;
        HEAP32[(((ptr)+(20))>>2)]=value4;
        HEAP32[(((ptr)+(24))>>2)]=value4;
        HEAP32[(((ptr)+(28))>>2)]=value4;
        HEAP32[(((ptr)+(32))>>2)]=value4;
        HEAP32[(((ptr)+(36))>>2)]=value4;
        HEAP32[(((ptr)+(40))>>2)]=value4;
        HEAP32[(((ptr)+(44))>>2)]=value4;
        HEAP32[(((ptr)+(48))>>2)]=value4;
        HEAP32[(((ptr)+(52))>>2)]=value4;
        HEAP32[(((ptr)+(56))>>2)]=value4;
        HEAP32[(((ptr)+(60))>>2)]=value4;
        ptr = (ptr + 64)|0;
      }

      while ((ptr|0) < (aligned_end|0) ) {
        HEAP32[((ptr)>>2)]=value4;
        ptr = (ptr+4)|0;
      }
    }
    // The remaining bytes.
    while ((ptr|0) < (end|0)) {
      HEAP8[((ptr)>>0)]=value;
      ptr = (ptr+1)|0;
    }
    return (end-num)|0;
}
function _sbrk(increment) {
    increment = increment|0;
    var oldDynamicTop = 0;
    var oldDynamicTopOnChange = 0;
    var newDynamicTop = 0;
    var totalMemory = 0;
    oldDynamicTop = HEAP32[DYNAMICTOP_PTR>>2]|0;
    newDynamicTop = oldDynamicTop + increment | 0;

    if (((increment|0) > 0 & (newDynamicTop|0) < (oldDynamicTop|0)) // Detect and fail if we would wrap around signed 32-bit int.
      | (newDynamicTop|0) < 0) { // Also underflow, sbrk() should be able to be used to subtract.
      abortOnCannotGrowMemory()|0;
      ___setErrNo(12);
      return -1;
    }

    totalMemory = _emscripten_get_heap_size()|0;
    if ((newDynamicTop|0) <= (totalMemory|0)) {
      HEAP32[DYNAMICTOP_PTR>>2] = newDynamicTop|0;
    } else {
      if ((_emscripten_resize_heap(newDynamicTop|0)|0) == 0) {
        ___setErrNo(12);
        return -1;
      }
    }
    return oldDynamicTop|0;
}

  
function dynCall_i(index) {
  index = index|0;
  
  return FUNCTION_TABLE_i[index&63]()|0;
}


function dynCall_ii(index,a1) {
  index = index|0;
  a1=a1|0;
  return FUNCTION_TABLE_ii[index&63](a1|0)|0;
}


function dynCall_iii(index,a1,a2) {
  index = index|0;
  a1=a1|0; a2=a2|0;
  return FUNCTION_TABLE_iii[index&63](a1|0,a2|0)|0;
}


function dynCall_iiii(index,a1,a2,a3) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0;
  return FUNCTION_TABLE_iiii[index&63](a1|0,a2|0,a3|0)|0;
}


function dynCall_iiiii(index,a1,a2,a3,a4) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0;
  return FUNCTION_TABLE_iiiii[index&63](a1|0,a2|0,a3|0,a4|0)|0;
}


function dynCall_v(index) {
  index = index|0;
  
  FUNCTION_TABLE_v[index&63]();
}


function dynCall_vi(index,a1) {
  index = index|0;
  a1=a1|0;
  FUNCTION_TABLE_vi[index&63](a1|0);
}


function dynCall_vii(index,a1,a2) {
  index = index|0;
  a1=a1|0; a2=a2|0;
  FUNCTION_TABLE_vii[index&63](a1|0,a2|0);
}


function dynCall_viii(index,a1,a2,a3) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0;
  FUNCTION_TABLE_viii[index&63](a1|0,a2|0,a3|0);
}


function dynCall_viiii(index,a1,a2,a3,a4) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0;
  FUNCTION_TABLE_viiii[index&63](a1|0,a2|0,a3|0,a4|0);
}


function dynCall_viiiii(index,a1,a2,a3,a4,a5) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0; a5=a5|0;
  FUNCTION_TABLE_viiiii[index&31](a1|0,a2|0,a3|0,a4|0,a5|0);
}


function dynCall_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0; a5=a5|0; a6=a6|0;
  FUNCTION_TABLE_viiiiii[index&31](a1|0,a2|0,a3|0,a4|0,a5|0,a6|0);
}

function b0() {
 ; nullFunc_i(0);return 0;
}
function b1(p0) {
 p0 = p0|0; nullFunc_ii(1);return 0;
}
function b2(p0,p1) {
 p0 = p0|0;p1 = p1|0; nullFunc_iii(2);return 0;
}
function b3(p0,p1,p2) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0; nullFunc_iiii(3);return 0;
}
function b4(p0,p1,p2,p3) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; nullFunc_iiiii(4);return 0;
}
function b5() {
 ; nullFunc_v(5);
}
function b6(p0) {
 p0 = p0|0; nullFunc_vi(6);
}
function b7(p0,p1) {
 p0 = p0|0;p1 = p1|0; nullFunc_vii(7);
}
function b8(p0,p1,p2) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0; nullFunc_viii(8);
}
function b9(p0,p1,p2,p3) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; nullFunc_viiii(9);
}
function b10(p0,p1,p2,p3,p4) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0; nullFunc_viiiii(10);
}
function b11(p0,p1,p2,p3,p4,p5) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0;p5 = p5|0; nullFunc_viiiiii(11);
}

// EMSCRIPTEN_END_FUNCS
var FUNCTION_TABLE_i = [b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0
,b0,b0,b0,b0,b0,b0,b0,__ZN10emscripten8internal12operator_newINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEJEEEPT_DpOT0_,b0,b0,b0,b0,b0,b0,b0,b0,b0,__ZN10emscripten8internal15raw_constructorI14StrategyResultJEEEPT_DpNS0_11BindingTypeIT0_E8WireTypeE,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0
,b0,b0,b0,b0,b0];
var FUNCTION_TABLE_ii = [b1,___stdio_close,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,__ZNKSt11logic_error4whatEv,b1,b1,b1,b1,b1,b1,b1,b1
,b1,b1,b1,b1,b1,__ZN10emscripten8internal13getActualTypeINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEPKvPT_,b1,b1,__ZN10emscripten8internal7InvokerIPNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEJEE6invokeEPFSC_vE,b1,b1,__ZNKSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE4sizeEv,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1
,b1,b1,b1,b1,b1];
var FUNCTION_TABLE_iii = [b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2
,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,__ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEKFmvEmPKSB_JEE6invokeERKSD_SF_,b2,b2,b2,b2,b2,b2,__ZN10emscripten8internal12MemberAccessI14StrategyResultiE7getWireIS2_EEiRKMS2_iRKT_,b2,__ZN10emscripten8internal12MemberAccessI14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEE7getWireIS2_EEPSC_RKMS2_SC_RKT_,b2,b2,b2,b2,b2,b2,b2,b2
,b2,b2,b2,b2,b2];
var FUNCTION_TABLE_iiii = [b3,b3,___stdio_write,___stdio_seek,___stdout_write,b3,b3,b3,b3,b3,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,__ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv,b3,__ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv,b3,b3,b3
,b3,b3,__ZN10emscripten8internal7InvokerI14StrategyResultJNSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEcEE6invokeEPFS2_S9_cEPNS0_11BindingTypeIS9_EUt_Ec,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,__ZN10emscripten8internal15FunctionInvokerIPFNS_3valERKNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEmES2_SE_JmEE6invokeEPSG_PSC_m,__ZN10emscripten8internal12VectorAccessINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3setERSB_mRKS9_,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3,b3
,b3,b3,b3,b3,b3];
var FUNCTION_TABLE_iiiii = [b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4
,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,__ZN10emscripten8internal15FunctionInvokerIPFbRNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEmRKS9_EbSC_JmSE_EE6invokeEPSG_PSB_mPNS0_11BindingTypeIS9_EUt_E,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4
,b4,b4,b4,b4,b4];
var FUNCTION_TABLE_v = [b5,b5,b5,b5,b5,__ZL25default_terminate_handlerv,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5
,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,__ZN10__cxxabiv112_GLOBAL__N_110construct_Ev,b5,b5,b5,b5,b5,b5
,b5,b5,b5,b5,b5];
var FUNCTION_TABLE_vi = [b6,b6,b6,b6,b6,b6,__ZN10__cxxabiv116__shim_type_infoD2Ev,__ZN10__cxxabiv117__class_type_infoD0Ev,__ZNK10__cxxabiv116__shim_type_info5noop1Ev,__ZNK10__cxxabiv116__shim_type_info5noop2Ev,b6,b6,b6,b6,__ZN10__cxxabiv120__si_class_type_infoD0Ev,b6,b6,b6,__ZNSt11logic_errorD2Ev,__ZNSt11logic_errorD0Ev,b6,__ZNSt12length_errorD0Ev,__ZN10__cxxabiv123__fundamental_type_infoD0Ev,b6,__ZN10__cxxabiv119__pointer_type_infoD0Ev,b6,__ZN10__cxxabiv121__vmi_class_type_infoD0Ev,b6,b6
,b6,b6,b6,b6,b6,b6,__ZN10emscripten8internal14raw_destructorINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEEEvPT_,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,__ZN10emscripten8internal14raw_destructorI14StrategyResultEEvPT_,b6,b6,b6,b6,b6,__ZN10__cxxabiv112_GLOBAL__N_19destruct_EPv,b6,b6,b6,b6,b6
,b6,b6,b6,b6,b6];
var FUNCTION_TABLE_vii = [b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7
,b7,b7,b7,__ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE9push_backERKS6_,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7
,b7,b7,b7,b7,b7];
var FUNCTION_TABLE_viii = [b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8
,b8,__Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEc,b8,b8,__ZNSt3__26vectorINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS4_IS6_EEE6resizeEmRKS6_,b8,b8,b8,b8,__ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvRKS9_EvPSB_JSD_EE6invokeERKSF_SG_PNS0_11BindingTypeIS9_EUt_E,b8,b8,b8,__ZN10emscripten8internal12VectorAccessINSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEE3getERKSB_m,b8,b8,b8,b8,b8,b8,__ZN10emscripten8internal12MemberAccessI14StrategyResultiE7setWireIS2_EEvRKMS2_iRT_i,b8,__ZN10emscripten8internal12MemberAccessI14StrategyResultNSt3__26vectorINS3_12basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEENS8_ISA_EEEEE7setWireIS2_EEvRKMS2_SC_RT_PSC_,b8,b8,b8,b8,b8,b8,b8
,b8,b8,b8,b8,b8];
var FUNCTION_TABLE_viiii = [b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b9,b9,b9,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9
,__ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b9,b9,b9,b9,b9,b9,b9,b9,b9,__ZN10emscripten8internal13MethodInvokerIMNSt3__26vectorINS2_12basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEENS7_IS9_EEEEFvmRKS9_EvPSB_JmSD_EE6invokeERKSF_SG_mPNS0_11BindingTypeIS9_EUt_E,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9
,b9,b9,b9,b9,b9];
var FUNCTION_TABLE_viiiii = [b10,b10,b10,b10,b10,b10,b10,b10,b10,b10,b10,b10,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b10,b10,b10,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b10,b10,b10,b10,b10,b10,b10,b10,b10,b10,b10,__ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib
,b10,b10,b10];
var FUNCTION_TABLE_viiiiii = [b11,b11,b11,b11,b11,b11,b11,b11,b11,b11,b11,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b11,b11,b11,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b11,b11,b11,b11,b11,b11,b11,b11,b11,b11,b11,__ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b11
,b11,b11,b11];

  return { __GLOBAL__sub_I_bind_cpp: __GLOBAL__sub_I_bind_cpp, __GLOBAL__sub_I_strategy_cpp: __GLOBAL__sub_I_strategy_cpp, __Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEc: __Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEc, ___cxa_can_catch: ___cxa_can_catch, ___cxa_is_pointer_type: ___cxa_is_pointer_type, ___errno_location: ___errno_location, ___getTypeName: ___getTypeName, ___muldi3: ___muldi3, ___udivdi3: ___udivdi3, _bitshift64Lshr: _bitshift64Lshr, _bitshift64Shl: _bitshift64Shl, _fflush: _fflush, _free: _free, _i64Add: _i64Add, _i64Subtract: _i64Subtract, _llvm_bswap_i32: _llvm_bswap_i32, _malloc: _malloc, _memcpy: _memcpy, _memmove: _memmove, _memset: _memset, _sbrk: _sbrk, dynCall_i: dynCall_i, dynCall_ii: dynCall_ii, dynCall_iii: dynCall_iii, dynCall_iiii: dynCall_iiii, dynCall_iiiii: dynCall_iiiii, dynCall_v: dynCall_v, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_viii: dynCall_viii, dynCall_viiii: dynCall_viiii, dynCall_viiiii: dynCall_viiiii, dynCall_viiiiii: dynCall_viiiiii, establishStackSpace: establishStackSpace, setThrew: setThrew, stackAlloc: stackAlloc, stackRestore: stackRestore, stackSave: stackSave };
})
;