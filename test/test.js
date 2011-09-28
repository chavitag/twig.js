// Twig.debug = true;

var test_data = [
    {a: 10, b: 15},
    {a: 0, b: 0},
    {a: 1, b: 11},
    {a: 10444, b: 0.5},
    {a: 1034, b: -53},
    {a: -56, b: -1.7},
    {a: 34, b: 0},
    {a: 14, b: 14}
]

module("Tags");
test("tags.output", function() {
    // Really all we care about here is not throwing exceptions.
    equal( twig({data: '{{ "test" }}'}).render(), "test" );
    equal( twig({data: '{{ " }} " }}'}).render(), " }} " );
    equal( twig({data: '{{ " \\"}} " }}'}).render(), ' "}} ' );
    equal( twig({data: "{{ ' }} ' }}"}).render(), " }} " );
    equal( twig({data: "{{ ' \\'}} ' }}"}).render(), " '}} " );

    equal( twig({data: '{{ " \'}} " }}'}).render(), " '}} " );
    equal( twig({data: "{{ ' \"}} ' }}"}).render(), ' "}} ' );
});


module("Static Expressions");

test("static.number", function() {
    expect(3);
    equal( twig({data: '{{ 12 }}'}).render(), "12" );
    equal( twig({data: '{{ 12.64 }}'}).render(), "12.64" );
    equal( twig({data: '{{ .64 }}'}).render(), ".64" );
});

test("static.string", function() {
    expect(6);
    equal( twig({data: '{{ "double" }}'}).render(), "double" );
    equal( twig({data: "{{ 'single' }}"}).render(), 'single' );
    equal( twig({data: '{{ "dou\'ble" }}'}).render(), "dou'ble" );
    equal( twig({data: "{{ 'sin\"gle' }}"}).render(), 'sin"gle' );
    equal( twig({data: '{{ "dou\\"ble" }}'}).render(), "dou\"ble" );
    equal( twig({data: "{{ 'sin\\'gle' }}"}).render(), "sin'gle" );
});

// Expression tests
module("Basic Expressions");

test("expression.add", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a + b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a + pair.b).toString() );
    });
});

test("expression.subtract", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a - b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a - pair.b).toString() );
    });
});

test("expression.multiply", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a * b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a * pair.b).toString() );
    });
});

test("expression.divide", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a / b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a / pair.b).toString() );
    });
});

test("expression.concat.number", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a ~ b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, pair.a.toString() + pair.b.toString() );
    });
});

string_data = [
    {a: 'test', b: 'string'},
    {a: 'test', b: ''},
    {a: '', b: 'string'},
    {a: '', b: ''},
]

test("expression.concat.string", function() {
    expect(string_data.length);
    var test_template = twig({data: '{{ a ~ b }}'});
    string_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, pair.a.toString() + pair.b.toString() );
    });
});

module("Combined Expressions");

test("combined.concat", function() {
    equal( twig({data: '{{ "test" ~ a }}'}).render({a:1234}), "test1234" );
    equal( twig({data: '{{ a ~ "test" ~ a }}'}).render({a:1234}), "1234test1234" );
    equal( twig({data: '{{ "this" ~ "test" }}'}).render({a:1234}), "thistest" );
});

test("combined.basic", function() {
    var data = {a: 4.5, b: 10, c: 12,  d: -0.25, e:0, f: 65,  g: 21, h: -0.0002};
    var test_template = twig({data: '{{a/b+c*d-e+f/g*h}}'});
    var output = test_template.render(data);
    var expected = data.a / data.b + data.c * data.d - data.e + data.f / data.g * data.h;
    equal( output, expected.toString() );
});
test("combined.parens", function() {
    var data = {a: 4.5, b: 10, c: 12,  d: -0.25, e:0, f: 65,  g: 21, h: -0.0002};
    var test_template = twig({data: '{{a   /(b+c )*d-(e+f)/(g*h)}}'});
    var output = test_template.render(data);
    var expected = data.a / (data.b + data.c) * data.d - (data.e + data.f) / (data.g * data.h);
    equal( output, expected.toString() );
});

module("Comparison Expressions");

test("comparison.lessThen", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a < b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a < pair.b).toString() );
    });
});

test("comparison.lessThenOrEqual", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a <= b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a <= pair.b).toString() );
    });
});

test("comparison.greaterThen", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a > b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a > pair.b).toString() );
    });
});

test("comparison.greaterThenOrEqual", function() {
    expect(test_data.length);
    var test_template = twig({data: '{{ a >= b }}'});
    test_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a >= pair.b).toString() );
    });
});

var boolean_data = [
    {a: true, b: true},
    {a: true, b: false},
    {a: false, b: true},
    {a: false, b: false}
];

test("comparison.equals", function() {
    expect(boolean_data.length);
    var test_template = twig({data: '{{ a == b }}'});
    boolean_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a == pair.b).toString() );
    });
});

test("comparison.notEquals", function() {
    expect(boolean_data.length);
    var test_template = twig({data: '{{ a != b }}'});
    boolean_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a != pair.b).toString() );
    });
});

test("comparison.or", function() {
    expect(boolean_data.length);
    var test_template = twig({data: '{{ a || b }}'});
    boolean_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a || pair.b).toString() );
    });
});

test("comparison.and", function() {
    expect(boolean_data.length);
    var test_template = twig({data: '{{ a && b }}'});
    boolean_data.forEach(function(pair) {
        var output = test_template.render(pair);
        equal( output, (pair.a && pair.b).toString() );
    });
});

test("comparison.not", function() {
    expect(2);
    var test_template = twig({data: '{{ !a }}'});
    equal( test_template.render({a:false}), true.toString() );
    equal( test_template.render({a:true}), false.toString() );
});

module("Logic/If");

test("if.basic", function() {
    expect(2);
    var test_template = twig({data: '{% if test %}true{% endif%}'});
    equal( test_template.render({test: true}), "true" );
    equal( test_template.render({test: false}), "" );
});

test("if.else", function() {
    expect(2);
    var test_template = twig({data: '{% if test %}true{%else%}false{% endif%}'});
    equal( test_template.render({test: true}), "true" );
    equal( test_template.render({test: false}), "false" );
});

test("if.elseif", function() {
    expect(4);
    var test_template = twig({data: '{% if test %}1{% elseif other %}2{%else%}3{% endif%}'});
    equal( test_template.render({test: true, other:false}), "1" );
    equal( test_template.render({test: true, other:true}), "1" );
    equal( test_template.render({test: false, other:true}), "2" );
    equal( test_template.render({test: false, other:false}), "3" );
});

/* var example = twig({
    html: 'The {{ baked_good }} is a lie. {{ 12.5 + 10 / (2 - 4) + 6.5}} == 14.<br /> 123 % 4 = {{ 123 % 4 }}'
});
console.log(example); */
