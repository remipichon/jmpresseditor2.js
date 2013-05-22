function initPostthes(id) {
    console.log('init');
    $('#idthesE').attr('value', id.match(/[0-9]/)[0]);
    console.log(id + 'nom');
    var val = CKEDITOR.instances[id + 'nom'].getData();
    $('#inputnom').attr('value', val);
    console.log(id + 'imageType');
    var val = CKEDITOR.instances[id + 'imageType'].getData();
    $('#inputimageType').attr('value', val);
    console.log(id + 'pays_orig');
    var val = CKEDITOR.instances[id + 'pays_orig'].getData();
    $('#inputpays_orig').attr('value', val);
    console.log(id + 'prix');
    var val = CKEDITOR.instances[id + 'prix'].getData();
    $('#inputprix').attr('value', val);
    console.log(id + 'designation');
    var val = CKEDITOR.instances[id + 'designation'].getData();
    $('#inputdesignation').attr('value', val);
    $('#submitthes').trigger('click');
} 