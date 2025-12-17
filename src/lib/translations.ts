export type Language = 'en' | 'th';

export interface Translations {
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    export: string;
    import: string;
    search: string;
    clear: string;
    close: string;
    yes: string;
    no: string;
    ok: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    or: string;
    and: string;
    dragToReorder: string;
    dropHere: string;
    unsavedChanges: string;
    dataStaysOnDevice: string;
    undo: string;
  };
  navigation: {
    home: string;
    builder: string;
    run: string;
    studio: string;
  };
  homePage: {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    privacyFirst: string;
    supportedTypes: string;
    studyTypes: {
      open: string;
      openDesc: string;
      closed: string;
      closedDesc: string;
      hybrid: string;
      hybridDesc: string;
    };
    features: {
      title: string;
      builder: {
        title: string;
        description: string;
      };
      runner: {
        title: string;
        description: string;
      };
      studio: {
        title: string;
        description: string;
      };
    };
  };
  builderPage: {
    title: string;
    subtitle: string;
    progress: {
      title: string;
      notSet: string;
      type: string;
      categories: string;
      cards: string;
    };
    studySettings: string;
    studyTitle: string;
    studyDescription: string;
    instructions: string;
    cardManagement: {
      title: string;
      addCard: string;
      cardLabel: string;
      cardDescription: string;
      noCards: string;
      addCardsToStart: string;
    };
    categoryManagement: {
      title: string;
      addCategory: string;
      categoryLabel: string;
      categoryDescription: string;
      noCategories: string;
      addCategoriesToStart: string;
    };
    settings: {
      randomizeCards: string;
      allowCreateCategories: string;
      requireAllSorted: string;
      enableUnsureBucket: string;
      unsureBucketLabel: string;
    };
    actions: {
      runStudy: string;
      exportTemplate: string;
      reset: string;
      confirmReset: string;
    };
  };
  runPage: {
    title: string;
    uploadDescription: string;
    clickToUpload: string;
    instructions: string;
    nameAliasHint: string;
    uploadDifferentTemplate: string;
    sorted: string;
    reviewAndExport: string;
    participantInfo: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      uploadTemplate: string;
      startSession: string;
    };
    sorting: {
      unsortedCards: string;
      unsure: string;
      cardsRemaining: string;
      allCardsSorted: string;
      exportResult: string;
      resetPlacements: string;
    };
    messages: {
      enterName: string;
      invalidTemplate: string;
      failedToReadTemplate: string;
      resultExported: string;
      failedToExport: string;
      pleaseSortAll: string;
      confirmReset: string;
    };
  };
  studioPage: {
    title: string;
    hideSidebar: string;
    showSidebar: string;
    untitledStudy: string;
    categories: string;
    cards: string;
    backToEdit: string;
    startCardSorting: string;
    preview: {
      label: string;
      toTestHint: string;
      previewModeMessage: string;
      title: string;
      description: string;
      categories: string;
      cards: string;
      addCardsToStart: string;
    };
    export: {
      title: string;
      description: string;
      filename: string;
      download: string;
    };
    messages: {
      invalidTemplate: string;
      templateImported: string;
      loadedCardsAndCategories: string;
      failedToReadTemplate: string;
      enterTitleBeforeExport: string;
      addCardBeforeExport: string;
      templateExported: string;
      addCardsBeforeStart: string;
      addCategoriesForClosed: string;
    };
  };
  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
    invalidUrl: string;
    invalidFile: string;
  };
  accessibility: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    loading: string;
    error: string;
    cardMoved: string;
    cardDropped: string;
    studyStarted: string;
    studyCompleted: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      export: 'Export',
      import: 'Import',
      search: 'Search',
      clear: 'Clear',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      required: 'Required',
      optional: 'Optional',
      or: 'or',
      and: 'and',
      dragToReorder: 'Drag to reorder',
      dropHere: 'Drop cards here',
      unsavedChanges: 'You have unsaved changes',
      dataStaysOnDevice: 'All data stays on your device. No server, no tracking.',
      undo: 'Undo',
    },
    navigation: {
      home: 'Home',
      builder: 'Builder',
      run: 'Run',
      studio: 'Studio',
    },
    homePage: {
      title: 'Card Sorting Platform',
      subtitle: 'Professional UX Research Tool',
      description: 'Create and conduct card sorting studies to understand how users organize information. Perfect for information architecture research and user experience design.',
      getStarted: 'Get Started',
      privacyFirst: 'Privacy first',
      supportedTypes: 'Supported Study Types',
      studyTypes: {
        open: 'Open Sort',
        openDesc: 'Participants create their own categories',
        closed: 'Closed Sort',
        closedDesc: 'Participants sort into predefined categories',
        hybrid: 'Hybrid Sort',
        hybridDesc: 'Base categories provided, participants can add more',
      },
      features: {
        title: 'Everything you need for professional card sorting',
        builder: {
          title: 'Study Builder',
          description: 'Create studies with cards, categories, and custom settings',
        },
        runner: {
          title: 'Study Runner',
          description: 'Conduct studies with real-time feedback and results',
        },
        studio: {
          title: 'Preview Studio',
          description: 'Test and refine your study before deployment',
        },
      },
    },
    builderPage: {
      title: 'Study Builder',
      subtitle: 'Create a card sorting study template',
      progress: {
        title: 'Title',
        notSet: '(not set)',
        type: 'Type',
        categories: 'Categories',
        cards: 'Cards',
      },
      studySettings: 'Study Settings',
      studyTitle: 'Study Title',
      studyDescription: 'Study Description',
      instructions: 'Instructions',
      cardManagement: {
        title: 'Cards',
        addCard: 'Add Card',
        cardLabel: 'Card Label',
        cardDescription: 'Description (optional)',
        noCards: 'No cards yet',
        addCardsToStart: 'Add some cards to get started',
      },
      categoryManagement: {
        title: 'Categories',
        addCategory: 'Add Category',
        categoryLabel: 'Category Label',
        categoryDescription: 'Description (optional)',
        noCategories: 'No categories yet',
        addCategoriesToStart: 'Add categories for participants to sort cards into',
      },
      settings: {
        randomizeCards: 'Randomize card order',
        allowCreateCategories: 'Allow participants to create categories',
        requireAllSorted: 'Require all cards to be sorted',
        enableUnsureBucket: 'Enable "Unsure" bucket',
        unsureBucketLabel: 'Unsure bucket label',
      },
      actions: {
        runStudy: 'Run Study',
        exportTemplate: 'Export Template',
        reset: 'Reset Study',
        confirmReset: 'Are you sure you want to reset? All unsaved changes will be lost.',
      },
    },
    runPage: {
      title: 'Run Study',
      uploadDescription: 'Upload a template JSON file to begin the study.',
      clickToUpload: 'Click to upload template.json',
      instructions: 'Instructions',
      nameAliasHint: 'Use an alias if you prefer not to share your real name.',
      uploadDifferentTemplate: 'Upload different template',
      sorted: 'sorted',
      reviewAndExport: 'Review & Export',
      participantInfo: {
        title: 'Participant Information',
        nameLabel: 'Name',
        namePlaceholder: 'Enter your name',
        uploadTemplate: 'Upload Template',
        startSession: 'Start Session',
      },
      sorting: {
        unsortedCards: 'Unsorted Cards',
        unsure: 'Unsure',
        cardsRemaining: 'cards remaining',
        allCardsSorted: 'All cards sorted!',
        exportResult: 'Export Result',
        resetPlacements: 'Reset',
      },
      messages: {
        enterName: 'Please enter your name or alias',
        invalidTemplate: 'Invalid template',
        failedToReadTemplate: 'Failed to read template file',
        resultExported: 'Result exported successfully!',
        failedToExport: 'Failed to export result',
        pleaseSortAll: 'Please sort all cards before exporting',
        confirmReset: 'Reset all card placements?',
      },
    },
    studioPage: {
      title: 'Preview Studio',
      hideSidebar: 'Hide sidebar',
      showSidebar: 'Show sidebar',
      untitledStudy: 'Untitled Study',
      categories: 'categories',
      cards: 'cards',
      backToEdit: 'Back to Edit',
      startCardSorting: 'Start Card Sorting',
      preview: {
        label: 'Preview',
        toTestHint: 'To test, click Run Study',
        previewModeMessage: 'You are currently in Preview mode.',
        title: 'Sort Board Preview',
        description: 'Configure your study in the left panel, then click "Run Study" to start the card sorting session.',
        categories: 'Categories',
        cards: 'Cards',
        addCardsToStart: 'Add some cards to get started',
      },
      export: {
        title: 'Export Results',
        description: 'Download the study results as a JSON file for analysis.',
        filename: 'Filename',
        download: 'Download',
      },
      messages: {
        invalidTemplate: 'Invalid template',
        templateImported: 'Template imported',
        loadedCardsAndCategories: 'Loaded {{cards}} cards and {{categories}} categories',
        failedToReadTemplate: 'Failed to read template file',
        enterTitleBeforeExport: 'Please enter a study title before exporting',
        addCardBeforeExport: 'Please add at least one card before exporting',
        templateExported: 'Template exported',
        addCardsBeforeStart: 'Please add cards before starting',
        addCategoriesForClosed: 'Please add categories for closed/hybrid sort',
      },
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      minLength: 'Must be at least {{count}} characters',
      maxLength: 'Must be no more than {{count}} characters',
      invalidUrl: 'Please enter a valid URL',
      invalidFile: 'Please select a valid file',
    },
    accessibility: {
      skipToContent: 'Skip to main content',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      loading: 'Loading content',
      error: 'Error occurred',
      cardMoved: 'Card moved to {{category}}',
      cardDropped: 'Card dropped',
      studyStarted: 'Study started',
      studyCompleted: 'Study completed',
    },
  },
  th: {
    common: {
      loading: 'กำลังโหลด...',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      delete: 'ลบ',
      edit: 'แก้ไข',
      add: 'เพิ่ม',
      remove: 'ลบออก',
      confirm: 'ยืนยัน',
      back: 'ย้อนกลับ',
      next: 'ถัดไป',
      previous: 'ก่อนหน้า',
      submit: 'ส่ง',
      reset: 'รีเซ็ต',
      export: 'ส่งออก',
      import: 'นำเข้า',
      search: 'ค้นหา',
      clear: 'ล้างข้อมูล',
      close: 'ปิด',
      yes: 'ใช่',
      no: 'ไม่',
      ok: 'ตกลง',
      error: 'ข้อผิดพลาด',
      success: 'สำเร็จ',
      warning: 'คำเตือน',
      info: 'ข้อมูล',
      required: 'จำเป็น',
      optional: 'ไม่จำเป็น',
      or: 'หรือ',
      and: 'และ',
      dragToReorder: 'ลากเพื่อจัดลำดับใหม่',
      dropHere: 'วางการ์ดที่นี่',
      unsavedChanges: 'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก',
      dataStaysOnDevice: 'ข้อมูลทั้งหมดจะถูกเก็บไว้บนอุปกรณ์ของคุณ ไม่มีเซิร์ฟเวอร์ ไม่มีการติดตาม',
      undo: 'เลิกทำ',
    },
    navigation: {
      home: 'หน้าแรก',
      builder: 'สร้างการศึกษา',
      run: 'ทำการศึกษา',
      studio: 'สตูดิโอ',
    },
    homePage: {
      title: 'แพลตฟอร์มการ์ดเสริจ',
      subtitle: 'เครื่องมือวิจัย UX ระดับมืออาชีพ',
      description: 'สร้างและดำเนินการศึกษาการ์ดเสริจเพื่อทำความเข้าใจว่าผู้ใช้จัดระเบียบข้อมูลอย่างไร เหมาะสำหรับการวิจัยสถาปัตยกรรมข้อมูลและการออกแบบประสบการณ์ผู้ใช้',
      getStarted: 'เริ่มต้นใช้งาน',
      privacyFirst: 'ความเป็นส่วนตัวมาก่อน',
      supportedTypes: 'ประเภทการศึกษาที่รองรับ',
      studyTypes: {
        open: 'การจัดกลุ่มแบบเปิด',
        openDesc: 'ผู้เข้าร่วมสร้างหมวดหมู่ของตนเอง',
        closed: 'การจัดกลุ่มแบบปิด',
        closedDesc: 'ผู้เข้าร่วมจัดการ์ดลงในหมวดหมู่ที่กำหนดไว้',
        hybrid: 'การจัดกลุ่มแบบผสม',
        hybridDesc: 'มีหมวดหมู่พื้นฐานให้ ผู้เข้าร่วมสามารถเพิ่มเติมได้',
      },
      features: {
        title: 'ทุกสิ่งที่คุณต้องการสำหรับการ์ดเสริจระดับมืออาชีพ',
        builder: {
          title: 'เครื่องมือสร้างการศึกษา',
          description: 'สร้างการศึกษาด้วยการ์ด หมวดหมู่ และการตั้งค่าแบบกำหนดเอง',
        },
        runner: {
          title: 'เครื่องมือดำเนินการศึกษา',
          description: 'ดำเนินการศึกษาพร้อมข้อเสนอแนะและผลลัพธ์แบบเรียลไทม์',
        },
        studio: {
          title: 'สตูดิโอพรีวิว',
          description: 'ทดสอบและปรับปรุงการศึกษาก่อนเปิดใช้งานจริง',
        },
      },
    },
    builderPage: {
      title: 'เครื่องมือสร้างการศึกษา',
      subtitle: 'สร้างเทมเพลตการศึกษาการ์ดเสริจ',
      progress: {
        title: 'ชื่อ',
        notSet: '(ยังไม่ได้ตั้งค่า)',
        type: 'ประเภท',
        categories: 'หมวดหมู่',
        cards: 'การ์ด',
      },
      studySettings: 'การตั้งค่าการศึกษา',
      studyTitle: 'ชื่อการศึกษา',
      studyDescription: 'คำอธิบายการศึกษา',
      instructions: 'คำแนะนำ',
      cardManagement: {
        title: 'การ์ด',
        addCard: 'เพิ่มการ์ด',
        cardLabel: 'ชื่อการ์ด',
        cardDescription: 'คำอธิบาย (ไม่จำเป็น)',
        noCards: 'ยังไม่มีการ์ด',
        addCardsToStart: 'เพิ่มการ์ดเพื่อเริ่มต้น',
      },
      categoryManagement: {
        title: 'หมวดหมู่',
        addCategory: 'เพิ่มหมวดหมู่',
        categoryLabel: 'ชื่อหมวดหมู่',
        categoryDescription: 'คำอธิบาย (ไม่จำเป็น)',
        noCategories: 'ยังไม่มีหมวดหมู่',
        addCategoriesToStart: 'เพิ่มหมวดหมู่สำหรับผู้เข้าร่วมในการจัดหมวดหมู่การ์ด',
      },
      settings: {
        randomizeCards: 'สุ่มลำดับการ์ด',
        allowCreateCategories: 'อนุญาตให้ผู้เข้าร่วมสร้างหมวดหมู่',
        requireAllSorted: 'กำหนดให้จัดการ์ดทั้งหมด',
        enableUnsureBucket: 'เปิดใช้งานหมวด "ไม่แน่ใจ"',
        unsureBucketLabel: 'ชื่อหมวดไม่แน่ใจ',
      },
      actions: {
        runStudy: 'เริ่มการศึกษา',
        exportTemplate: 'ส่งออกเทมเพลต',
        reset: 'รีเซ็ตการศึกษา',
        confirmReset: 'คุณแน่ใจหรือไม่ที่จะรีเซ็ต? การเปลี่ยนแปลงที่ยังไม่ได้บันทึกทั้งหมดจะสูญหาย',
      },
    },
    runPage: {
      title: 'ดำเนินการศึกษา',
      uploadDescription: 'อัปโหลดไฟล์เทมเพลต JSON เพื่อเริ่มการศึกษา',
      clickToUpload: 'คลิกเพื่ออัปโหลด template.json',
      instructions: 'คำแนะนำ',
      nameAliasHint: 'ใช้ชื่อเล่นหากคุณไม่ต้องการเปิดเผยชื่อจริง',
      uploadDifferentTemplate: 'อัปโหลดเทมเพลตอื่น',
      sorted: 'จัดแล้ว',
      reviewAndExport: 'ตรวจสอบและส่งออก',
      participantInfo: {
        title: 'ข้อมูลผู้เข้าร่วม',
        nameLabel: 'ชื่อ',
        namePlaceholder: 'กรุณากรอกชื่อ',
        uploadTemplate: 'อัปโหลดเทมเพลต',
        startSession: 'เริ่มเซสชัน',
      },
      sorting: {
        unsortedCards: 'การ์ดที่ยังไม่ได้จัด',
        unsure: 'ไม่แน่ใจ',
        cardsRemaining: 'การ์ดที่เหลือ',
        allCardsSorted: 'จัดการ์ดทั้งหมดแล้ว!',
        exportResult: 'ส่งออกผลลัพธ์',
        resetPlacements: 'รีเซ็ต',
      },
      messages: {
        enterName: 'กรุณากรอกชื่อหรือชื่อเล่น',
        invalidTemplate: 'เทมเพลตไม่ถูกต้อง',
        failedToReadTemplate: 'ไม่สามารถอ่านไฟล์เทมเพลตได้',
        resultExported: 'ส่งออกผลลัพธ์สำเร็จแล้ว!',
        failedToExport: 'ไม่สามารถส่งออกผลลัพธ์ได้',
        pleaseSortAll: 'กรุณาจัดการ์ดทั้งหมดก่อนส่งออก',
        confirmReset: 'รีเซ็ตการจัดวางการ์ดทั้งหมด?',
      },
    },
    studioPage: {
      title: 'สตูดิโอพรีวิว',
      hideSidebar: 'ซ่อนแถบด้านข้าง',
      showSidebar: 'แสดงแถบด้านข้าง',
      untitledStudy: 'การศึกษาที่ไม่มีชื่อ',
      categories: 'หมวดหมู่',
      cards: 'การ์ด',
      backToEdit: 'กลับไปแก้ไข',
      startCardSorting: 'เริ่มจัดการ์ด',
      preview: {
        label: 'พรีวิว',
        toTestHint: 'หากต้องการทดสอบ ให้คลิก "เริ่มการศึกษา"',
        previewModeMessage: 'ขณะนี้คุณอยู่ในโหมดพรีวิว',
        title: 'พรีวิวบอร์ดจัดการ์ด',
        description: 'กำหนดค่าการศึกษาในแผงด้านซ้าย จากนั้นคลิก "เริ่มการศึกษา" เพื่อเริ่มเซสชันการจัดการ์ด',
        categories: 'หมวดหมู่',
        cards: 'การ์ด',
        addCardsToStart: 'เพิ่มการ์ดเพื่อเริ่มต้น',
      },
      export: {
        title: 'ส่งออกผลลัพธ์',
        description: 'ดาวน์โหลดผลลัพธ์การศึกษาเป็นไฟล์ JSON เพื่อการวิเคราะห์',
        filename: 'ชื่อไฟล์',
        download: 'ดาวน์โหลด',
      },
      messages: {
        invalidTemplate: 'เทมเพลตไม่ถูกต้อง',
        templateImported: 'นำเข้าเทมเพลตสำเร็จ',
        loadedCardsAndCategories: 'โหลด {{cards}} การ์ดและ {{categories}} หมวดหมู่',
        failedToReadTemplate: 'ไม่สามารถอ่านไฟล์เทมเพลตได้',
        enterTitleBeforeExport: 'กรุณากรอกชื่อการศึกษาก่อนส่งออก',
        addCardBeforeExport: 'กรุณาเพิ่มการ์ดอย่างน้อย 1 การ์ดก่อนส่งออก',
        templateExported: 'ส่งออกเทมเพลตสำเร็จ',
        addCardsBeforeStart: 'กรุณาเพิ่มการ์ดก่อนเริ่ม',
        addCategoriesForClosed: 'กรุณาเพิ่มหมวดหมู่สำหรับการจัดกลุ่มแบบปิด/ผสม',
      },
    },
    validation: {
      required: 'จำเป็นต้องกรอกข้อมูลในช่องนี้',
      invalidEmail: 'กรุณากรอกอีเมลที่ถูกต้อง',
      minLength: 'ต้องมีอย่างน้อย {{count}} ตัวอักษร',
      maxLength: 'ต้องไม่เกิน {{count}} ตัวอักษร',
      invalidUrl: 'กรุณากรอก URL ที่ถูกต้อง',
      invalidFile: 'กรุณาเลือกไฟล์ที่ถูกต้อง',
    },
    accessibility: {
      skipToContent: 'ข้ามไปยังเนื้อหาหลัก',
      openMenu: 'เปิดเมนู',
      closeMenu: 'ปิดเมนู',
      loading: 'กำลังโหลดเนื้อหา',
      error: 'เกิดข้อผิดพลาด',
      cardMoved: 'การ์ดถูกย้ายไปยัง {{category}}',
      cardDropped: 'การ์ดถูกวาง',
      studyStarted: 'เริ่มการศึกษาแล้ว',
      studyCompleted: 'เสร็จสิ้นการศึกษา',
    },
  },
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[language];
  
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  // Fallback to English if key not found
  let fallback: unknown = translations.en;
  for (const k of keys) {
    fallback = (fallback as Record<string, unknown>)?.[k];
  }
  
  return typeof fallback === 'string' ? fallback : key;
}
