import React, { useState } from 'react';
import { Input, Card, Progress, Tag, Button, Upload, Select, Badge, Segmented, Modal, Table } from 'antd';
import { SearchOutlined, PlusOutlined, ArrowLeftOutlined, FilterOutlined, EditOutlined } from '@ant-design/icons';
import { initialTechPlaces } from './mockData';

const InspectionApp = () => {
  const [currentScreen, setCurrentScreen] = useState('main'); // main, techPlaces, stages, defects, inspectionCheck, masterDefects, defectRegistry
  const [techPlaces, setTechPlaces] = useState(initialTechPlaces);
  const [selectedTechPlace, setSelectedTechPlace] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showOnlyDefects, setShowOnlyDefects] = useState(false);
  const [defectModalVisible, setDefectModalVisible] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const [techPlacePhotos, setTechPlacePhotos] = useState({});

  // Состояние осмотра
  const [inspectionCompleted, setInspectionCompleted] = useState(false); // Исполнитель завершил осмотр
  const [inspectionAccepted, setInspectionAccepted] = useState(false); // Мастер принял осмотр
  const [registeredDefects, setRegisteredDefects] = useState([]); // Реестр дефектов

  // Получение статуса тех.места
  const getTechPlaceStatus = (techPlace) => {
    const hasInspectedStages = techPlace.stages.some(s => s.inspected);
    if (!hasInspectedStages) return 'not-inspected';
    
    const hasDefects = techPlace.stages.some(s => 
      s.defects.some(d => d.severity !== 'none')
    );
    return hasDefects ? 'has-defects' : 'no-defects';
  };

  // Получение цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      
      case 'no-defects': return '#52c41a';
      case 'has-defects': return '#ff4d4f';
      case 'not-inspected': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  // Подсчет прогресса
  const getProgress = (techPlace) => {
    const total = techPlace.stages.length;
    const inspected = techPlace.stages.filter(s => s.inspected).length;
    return { inspected, total, percent: Math.round((inspected / total) * 100) };
  };

  // Подсчет дефектов для этапа
  const getDefectCount = (stage) => {
    return stage.defects.filter(d => d.severity !== 'none').length;
  };

  // Получение статуса этапа
  const getStageStatus = (stage) => {
    const defectCount = getDefectCount(stage);
    if (defectCount > 0) return 'has-defects';
    if (stage.inspected) return 'no-defects';
    return 'not-inspected';
  };

  // Фильтрация тех.мест
  const filteredTechPlaces = techPlaces.filter(tp => {
    const matchesSearch = tp.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || tp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Получение уникальных типов
  const uniqueTypes = ['all', ...new Set(techPlaces.map(tp => tp.type))];

  // Handler for uploading photos to techPlace
  const handleTechPlacePhotoUpload = (techPlaceId, file) => {
    const files = Array.isArray(file) ? file : [file];
    const newPhotos = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
    setTechPlacePhotos(prev => ({
      ...prev,
      [techPlaceId]: [...(prev[techPlaceId] || []), ...newPhotos]
    }));
    return false; // Prevent default upload behavior
  };

  // Handler for deleting photo from techPlace
  const handleTechPlacePhotoDelete = (techPlaceId, photoIndex) => {
    setTechPlacePhotos(prev => ({
      ...prev,
      [techPlaceId]: prev[techPlaceId].filter((_, idx) => idx !== photoIndex)
    }));
  };

  // Обработчик загрузки фото
  const handlePhotoUpload = (defectId, file) => {
    const files = Array.isArray(file) ? file : [file];
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => {
                  if (defect.id === defectId) {
                    const newPhotos = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
                    return {
                      ...defect,
                      photos: [...defect.photos, ...newPhotos]
                    };
                  }
                  return defect;
                })
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
    return false;
  };

  // Обновление критичности дефекта
  const updateDefectSeverity = (defectId, severity) => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => 
                  defect.id === defectId ? { ...defect, severity } : defect
                )
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
  };

  // Обновление комментария
  const updateDefectComment = (defectId, comment) => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => 
                  defect.id === defectId ? { ...defect, comment } : defect
                )
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
  };

  // Завершить этап
  const completeStage = () => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                inspected: true
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    setCurrentScreen('stages');
  };

  // Фильтрация дефектов
  const getFilteredDefects = () => {
    if (!showOnlyDefects) return selectedStage.defects;
    return selectedStage.defects.filter(d => d.severity !== 'none');
  };

  // Главный экран
  const MainScreen = () => (
    <div style={{ 
      padding: '24px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ marginBottom: '32px', fontSize: '28px' }}>Система осмотра оборудования</h1>
        <p style={{ marginBottom: '32px', fontSize: '16px', color: '#666' }}>
          Добро пожаловать в систему осмотра технических мест
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => setCurrentScreen('techPlaces')}
            disabled={inspectionCompleted || inspectionAccepted}
            style={{ minWidth: '200px', height: '50px', fontSize: '18px' }}
          >
            Заполнить
          </Button>
          <Button 
            type="default" 
            size="large" 
            onClick={() => setCurrentScreen('inspectionCheck')}
            disabled={!inspectionCompleted || inspectionAccepted}
            style={{ minWidth: '200px', height: '50px', fontSize: '18px' }}
          >
            Проверка листа осмотра
          </Button>
          <Button 
            type="default" 
            size="large" 
            onClick={() => setCurrentScreen('defectRegistry')}
            style={{ minWidth: '200px', height: '50px', fontSize: '18px' }}
          >
            Реестр дефектов
          </Button>
        </div>
      </Card>
    </div>
  );

  // Экран списка техмест (для исполнителя)
  const TechPlacesScreen = () => (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setCurrentScreen('main')}
        style={{ marginBottom: '16px' }}
      >
        На главную
      </Button>
      
      <h1 style={{ marginBottom: '24px' }}>Технические места</h1>
      
      {!inspectionCompleted && (
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setInspectionCompleted(true);
            setCurrentScreen('main');
          }}
          style={{ 
            minWidth: '200px', 
            height: '50px', 
            fontSize: '18px',
            marginBottom: '24px'
          }}
        >
          Завершить осмотр
        </Button>
      )}
      
      {inspectionCompleted && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <span style={{ color: '#52c41a', fontWeight: 500 }}>Осмотр завершен</span>
        </div>
      )}
      
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Поиск по наименованию"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 250 }}
          placeholder="Фильтр по типу"
        >
          {uniqueTypes.map(type => (
            <Select.Option key={type} value={type}>
              {type === 'all' ? 'Все типы' : type}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTechPlaces.map(techPlace => {
          const status = getTechPlaceStatus(techPlace);
          const progress = getProgress(techPlace);
          const totalDefects = techPlace.stages.reduce((sum, s) => sum + s.defects.filter(d => d.severity !== 'none').length, 0);
          
          // Get photos from tech place card level only (not from defects)
          const allPhotos = techPlacePhotos[techPlace.id] || [];
          
          return (
            <Card
              key={techPlace.id}
              hoverable
              onClick={() => {
                setSelectedTechPlace(techPlace);
                setCurrentScreen('stages');
              }}
              style={{ 
                cursor: 'pointer',
                borderLeft: `6px solid ${getStatusColor(status)}`,
                transition: 'all 0.3s'
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{techPlace.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {totalDefects > 0 && <Tag color="red">Дефектов: {totalDefects}</Tag>}
                    <Tag color="blue">{techPlace.type}</Tag>
                  </div>
                </div>
                
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <span>Прогресс осмотра</span>
                    <span>{progress.inspected} из {progress.total}</span>
                  </div>
                  <Progress 
                    percent={progress.percent} 
                    strokeColor={status === 'has-defects' ? '#ff4d4f' : '#52c41a'}
                    showInfo={false}
                  />
                </div>

                {/* Photo attachment area - clicking here should NOT navigate */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px dashed #d9d9d9'
                  }}
                >
                  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
                    Фото объекта:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {allPhotos.map((photo, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img 
                          src={photo.url} 
                          alt={`Фото ${idx + 1}`}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                          }}
                        />
                        {idx < allPhotos.length && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => handleTechPlacePhotoDelete(techPlace.id, idx)}
                            style={{ 
                              position: 'absolute', 
                              top: '-8px', 
                              right: '-8px',
                              padding: '2px 6px',
                              minWidth: 'auto',
                              backgroundColor: '#fff',
                              borderRadius: '50%'
                            }}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    <Upload
                      accept="image/*"
                      multiple
                      showUploadList={false}
                      beforeUpload={(file) => handleTechPlacePhotoUpload(techPlace.id, file)}
                    >
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed #d9d9d9',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          color: '#666'
                        }}
                      >
                        <PlusOutlined style={{ fontSize: '20px' }} />
                        <span style={{ fontSize: '12px', marginTop: '4px' }}>Добавить</span>
                      </div>
                    </Upload>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Экран списка этапов (для исполнителя)
  const StagesScreen = () => (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setCurrentScreen('techPlaces')}
        style={{ marginBottom: '16px' }}
      >
        Назад
      </Button>
      
      <h1 style={{ marginBottom: '24px' }}>{selectedTechPlace.name}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedTechPlace.stages.map(stage => {
          const status = getStageStatus(stage);
          const defectCount = getDefectCount(stage);
          
          return (
            <Card
              key={stage.id}
              hoverable
              onClick={() => {
                setSelectedStage(stage);
                setCurrentScreen('defects');
              }}
              style={{ 
                cursor: 'pointer',
                borderLeft: `6px solid ${getStatusColor(status)}`,
                transition: 'all 0.3s'
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '18px' }}>
                    {stage.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Tag color={stage.inspected ? 'default' : 'default'} style={{ 
                      backgroundColor: stage.inspected ? 'transparent' : '#f0f0f0',
                      color: stage.inspected ? '#000' : '#8c8c8c',
                      border: stage.inspected ? '1px solid #d9d9d9' : 'none'
                    }}>
                      {stage.inspected ? 'Осмотрено' : 'Не осмотрено'}
                    </Tag>
                    
                    {defectCount > 0 ? (
                      <Tag color="red">Дефектов: {defectCount}</Tag>
                    ) : stage.inspected ? (
                      <Tag color="green">Нет дефектов</Tag>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Экран списка дефектов (для исполнителя)
  const DefectsScreen = () => {
    const filteredDefects = getFilteredDefects();
    
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setCurrentScreen('stages')}
          style={{ marginBottom: '16px' }}
        >
          Назад
        </Button>
        
        <h1 style={{ marginBottom: '16px' }}>{selectedStage.name}</h1>
        
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button 
            type={showOnlyDefects ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            onClick={() => setShowOnlyDefects(!showOnlyDefects)}
          >
            Только с дефектами
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {filteredDefects.map(defect => (
            <Card key={defect.id} style={{ borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0 }}>{defect.name}</h3>
                
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Критичность:</div>
                  <Segmented
                    value={defect.severity}
                    onChange={(value) => updateDefectSeverity(defect.id, value)}
                    block
                    options={[
                      { label: 'Нет дефекта', value: 'none' },
                      { label: 'Низкий', value: 'low' },
                      { label: 'Средний', value: 'medium' },
                      { label: 'Высокий', value: 'high' },
                    ]}
                    className={`severity-segmented severity-${defect.severity}`}
                  />
                </div>

                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Фото:</div>
                  <Upload
                    listType="picture-card"
                    multiple
                    fileList={defect.photos.map((photo, idx) => ({
                      uid: idx,
                      name: `photo-${idx}`,
                      status: 'done',
                      url: photo.url,
                    }))}
                    beforeUpload={(file) => handlePhotoUpload(defect.id, file)}
                    accept="image/*"
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Загрузить</div>
                    </div>
                  </Upload>
                </div>

                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Комментарий:</div>
                  <Input.TextArea
                    value={defect.comment}
                    onChange={(e) => updateDefectComment(defect.id, e.target.value)}
                    placeholder="Введите комментарий"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          type="primary" 
          size="large" 
          block
          onClick={completeStage}
        >
          Завершить этап
        </Button>
      </div>
    );
  };

  // Экран проверки листа осмотра (для мастера)
  const InspectionCheckScreen = () => {
    const [inspectionSearchText, setInspectionSearchText] = useState('');
    const [inspectionTypeFilter, setInspectionTypeFilter] = useState('all');
    const [defectFilter, setDefectFilter] = useState('all'); // all, has-defects, no-defects

    // Подсчет дефектов для тех.места
    const getTechPlaceDefects = (techPlace) => {
      let newDefects = 0;
      let totalDefects = 0;
      
      techPlace.stages.forEach(stage => {
        stage.defects.forEach(defect => {
          if (defect.severity !== 'none') {
            totalDefects++;
            // Новые дефекты - это дефекты на осмотренных этапах
            if (stage.inspected) {
              newDefects++;
            }
          }
        });
      });
      
      return { newDefects, totalDefects };
    };

    // Фильтрация тех.мест
    const filteredTechPlaces = techPlaces.filter(tp => {
      const matchesSearch = tp.name.toLowerCase().includes(inspectionSearchText.toLowerCase());
      const matchesType = inspectionTypeFilter === 'all' || tp.type === inspectionTypeFilter;
      const { totalDefects } = getTechPlaceDefects(tp);
      
      let matchesDefectFilter = true;
      if (defectFilter === 'has-defects') {
        matchesDefectFilter = totalDefects > 0;
      } else if (defectFilter === 'no-defects') {
        matchesDefectFilter = totalDefects === 0;
      }
      
      // Исключаем тех.места с 0 осмотренных этапов
      const hasInspectedStages = tp.stages.some(stage => stage.inspected);
      
      return matchesSearch && matchesType && matchesDefectFilter && hasInspectedStages;
    });

    // Получение уникальных типов
    const uniqueTypes = ['all', ...new Set(techPlaces.map(tp => tp.type))];

    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setCurrentScreen('main')}
          style={{ marginBottom: '16px' }}
        >
          На главную
        </Button>
        
        <h1 style={{ marginBottom: '24px' }}>Проверка листа осмотра</h1>
        
        {!inspectionAccepted && (
          <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                // Получаем все дефекты со всех тех.мест (только с критичностью low, medium, high)
                const allDefects = [];
                techPlaces.forEach(techPlace => {
                  techPlace.stages.forEach(stage => {
                    stage.defects.forEach(defect => {
                      // Только дефекты со статусом низкий, средний или высокий
                      if (defect.severity === 'low' || defect.severity === 'medium' || defect.severity === 'high') {
                        allDefects.push({
                          ...defect,
                          techPlaceId: techPlace.id,
                          techPlaceName: techPlace.name,
                          techPlaceType: techPlace.type,
                          stageName: stage.name,
                          stageId: stage.id,
                          registeredDate: new Date().toISOString().split('T')[0]
                        });
                      }
                    });
                  });
                });
                
                setRegisteredDefects(allDefects);
                setInspectionAccepted(true);
                setCurrentScreen('main');
              }}
              style={{ 
                minWidth: '200px', 
                height: '50px', 
                fontSize: '18px',
                backgroundColor: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              Принять осмотр
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => {
                setInspectionCompleted(false);
                setCurrentScreen('main');
              }}
              style={{ 
                minWidth: '200px', 
                height: '50px', 
                fontSize: '18px',
                backgroundColor: '#faad14',
                borderColor: '#faad14',
                color: '#fff'
              }}
            >
              Вернуть на доработку
            </Button>
          </div>
        )}

        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Поиск по наименованию"
            prefix={<SearchOutlined />}
            value={inspectionSearchText}
            onChange={(e) => setInspectionSearchText(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <Select
            value={inspectionTypeFilter}
            onChange={setInspectionTypeFilter}
            style={{ width: 200 }}
            placeholder="Фильтр по типу"
          >
            {uniqueTypes.map(type => (
              <Select.Option key={type} value={type}>
                {type === 'all' ? 'Все типы' : type}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={defectFilter}
            onChange={setDefectFilter}
            style={{ width: 200 }}
            placeholder="Фильтр по дефектам"
          >
            <Select.Option value="all">Все</Select.Option>
            <Select.Option value="has-defects">Есть дефекты</Select.Option>
            <Select.Option value="no-defects">Нет дефектов</Select.Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTechPlaces.map(techPlace => {
            const { newDefects, totalDefects } = getTechPlaceDefects(techPlace);
            
            return (
              <Card
                key={techPlace.id}
                hoverable
                onClick={() => {
                  setSelectedTechPlace(techPlace);
                  setCurrentScreen('masterDefects');
                }}
                style={{ 
                  borderRadius: '8px',
                  borderLeft: totalDefects > 0 ? '6px solid #ff4d4f' : '6px solid #52c41a',
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{techPlace.name}</h3>
                    <Tag color="blue">{techPlace.type}</Tag>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ color: '#666', fontSize: '14px' }}>Новые дефекты: </span>
                      <Tag color={newDefects > 0 ? 'red' : 'green'}>
                        {newDefects}
                      </Tag>
                    </div>
                    
                    <div>
                      <span style={{ color: '#666', fontSize: '14px' }}>Всего дефектов: </span>
                      <Tag color={totalDefects > 0 ? 'orange' : 'default'}>
                        {totalDefects}
                      </Tag>
                    </div>
                  </div>

                  {/* Photos from tech place card level */}
                  {techPlacePhotos[techPlace.id] && techPlacePhotos[techPlace.id].length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
                        Фото объекта:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {techPlacePhotos[techPlace.id].map((photo, idx) => (
                          <img 
                            key={idx} 
                            src={photo.url} 
                            alt={`Фото ${idx + 1}`}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #d9d9d9'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Экран проверки дефектов (для мастера)
  const MasterDefectsScreen = () => {
    const [editingDefectId, setEditingDefectId] = useState(null);
    const [tempSeverity, setTempSeverity] = useState({});
    const [addDefectModalVisible, setAddDefectModalVisible] = useState(false);
    const [selectedStageForDefect, setSelectedStageForDefect] = useState(null);

    // Получение всех дефектов для выбранного тех.места
    const getAllDefects = () => {
      const defects = [];
      selectedTechPlace.stages.forEach(stage => {
        stage.defects.forEach(defect => {
          // Дефекты с критичностью или с фото или с комментарием
          const hasSeverity = defect.severity !== 'none';
          const hasPhotos = defect.photos && defect.photos.length > 0;
          const hasComment = defect.comment && defect.comment.trim() !== '';
          
          if (hasSeverity || hasPhotos || hasComment) {
            defects.push({
              ...defect,
              stageName: stage.name
            });
          }
        });
      });
      return defects;
    };

    const defects = getAllDefects();

    // Получение цвета статуса
    const getStatusColor = (status) => {
      switch(status) {
        case 'new': return 'blue';
        case 'repeat': return 'orange';
        case 'not-confirmed': return 'default';
        default: return 'default';
      }
    };

    // Получение цвета критичности
    const getSeverityColor = (severity) => {
      if (severity === 'none') return '#d9d9d9';
      switch(severity) {
        case 'low': return '#d4b106';
        case 'medium': return '#d46b08';
        case 'high': return '#cf1322';
        default: return '#000';
      }
    };

    // Начать редактирование
    const handleStartEdit = (defect) => {
      setEditingDefectId(defect.id);
      setTempSeverity(prev => ({ ...prev, [defect.id]: defect.severity }));
    };

    // Сохранить изменения
    const handleSaveEdit = () => {
      setEditingDefectId(null);
    };

    // Отменить изменения
    const handleCancelEdit = (defectId) => {
      setEditingDefectId(null);
    };

    // Обновление критичности дефекта
    const updateDefectSeverity = (defectId, severity) => {
      const updatedTechPlaces = techPlaces.map(tp => {
        if (tp.id === selectedTechPlace.id) {
          return {
            ...tp,
            stages: tp.stages.map(stage => {
              return {
                ...stage,
                defects: stage.defects.map(defect => 
                  defect.id === defectId ? { ...defect, severity } : defect
                )
              };
            })
          };
        }
        return tp;
      });
      setTechPlaces(updatedTechPlaces);
      const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
      setSelectedTechPlace(updatedTechPlace);
    };

    // Изменение критичности
    const handleSeverityChange = (defectId, newSeverity) => {
      setTempSeverity(prev => ({ ...prev, [defectId]: newSeverity }));
      updateDefectSeverity(defectId, newSeverity);
    };

    // Получение актуальной критичности
    const getCurrentSeverity = (defect) => {
      if (editingDefectId === defect.id && tempSeverity[defect.id] !== undefined) {
        return tempSeverity[defect.id];
      }
      return defect.severity;
    };

    const isAnyEditing = editingDefectId !== null;

    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setCurrentScreen('inspectionCheck')}
          style={{ marginBottom: '16px' }}
        >
          Назад
        </Button>
        
        <h1 style={{ marginBottom: '24px' }}>{selectedTechPlace.name}</h1>
        <p style={{ marginBottom: '24px', color: '#666' }}>Дефекты для проверки мастером</p>

        <Button 
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setAddDefectModalVisible(true)}
          style={{ 
            minWidth: '220px', 
            height: '56px', 
            fontSize: '18px',
            marginBottom: '24px'
          }}
        >
          Добавить дефект
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {defects.map(defect => {
            const isEditing = editingDefectId === defect.id;
            const currentSeverity = getCurrentSeverity(defect);
            
            return (
            <Card
              key={defect.id}
              style={{ 
                borderRadius: '8px',
                borderLeft: `4px solid ${getSeverityColor(currentSeverity)}`,
                backgroundColor: isEditing ? '#f5f5f5' : '#fff'
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{defect.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Tag color={getStatusColor(defect.status)}>
                      {defect.status === 'new' ? 'Новый' : defect.status === 'repeat' ? 'Повтор' : 'Не подтвержден'}
                    </Tag>
                    {!isAnyEditing && (
                      <Button 
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleStartEdit(defect)}
                      >
                        Редактировать
                      </Button>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#666', fontSize: '14px' }}>Дата обнаружения: </span>
                    <span style={{ fontWeight: '500' }}>{defect.date}</span>
                  </div>
                  
                  <div>
                    <span style={{ color: '#666', fontSize: '14px' }}>Критичность: </span>
                    {isEditing ? (
                      <Segmented
                        value={currentSeverity}
                        onChange={(value) => handleSeverityChange(defect.id, value)}
                        options={[
                          { label: 'Нет дефекта', value: 'none' },
                          { label: 'Низкий', value: 'low' },
                          { label: 'Средний', value: 'medium' },
                          { label: 'Высокий', value: 'high' },
                        ]}
                        size="small"
                      />
                    ) : (
                      <Tag color={currentSeverity === 'none' ? 'default' : currentSeverity === 'low' ? 'gold' : currentSeverity === 'medium' ? 'orange' : 'red'}>
                        {currentSeverity === 'none' ? 'Нет дефекта' : currentSeverity === 'low' ? 'Низкий' : currentSeverity === 'medium' ? 'Средний' : 'Высокий'}
                      </Tag>
                    )}
                  </div>
                </div>

                {defect.photos && defect.photos.length > 0 && (
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: '500' }}>Фотографии:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {defect.photos.map((photo, idx) => (
                        <img 
                          key={idx} 
                          src={photo.url} 
                          alt={`Фото ${idx + 1}`}
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {defect.comment && (
                  <div>
                    <span style={{ color: '#666', fontSize: '14px' }}>Комментарий: </span>
                    <span>{defect.comment}</span>
                  </div>
                )}
              </div>
            </Card>
          )})}

          {defects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Нет дефектов для отображения
            </div>
          )}
        </div>

        <Modal
          title={selectedStageForDefect ? `Дефекты: ${selectedStageForDefect.name}` : 'Выберите этап осмотра'}
          open={addDefectModalVisible}
          onCancel={() => {
            setAddDefectModalVisible(false);
            setSelectedStageForDefect(null);
          }}
          footer={null}
          width={700}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {selectedStageForDefect ? (
              <>
                <Button 
                  onClick={() => setSelectedStageForDefect(null)}
                  style={{ marginBottom: '8px', alignSelf: 'flex-start' }}
                  icon={<ArrowLeftOutlined />}
                >
                  К списку этапов
                </Button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedStageForDefect.defects
                    .filter(defect => defect.severity === 'none')
                    .map(defect => (
                    <Card
                      key={defect.id}
                      style={{ 
                        borderLeft: `4px solid ${
                          defect.severity === 'none' ? '#d9d9d9' : 
                          defect.severity === 'low' ? '#d4b106' : 
                          defect.severity === 'medium' ? '#d46b08' : '#cf1322'
                        }`
                      }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px', fontWeight: '500' }}>{defect.name}</span>
                        </div>
                        
                        <div>
                          <span style={{ color: '#666', fontSize: '14px', marginRight: '12px' }}>Критичность: </span>
                          <Segmented
                            value={defect.severity}
                            onChange={(value) => {
                              // Update defect severity
                              const updatedTechPlaces = techPlaces.map(tp => {
                                if (tp.id === selectedTechPlace.id) {
                                  return {
                                    ...tp,
                                    stages: tp.stages.map(stage => {
                                      if (stage.id === selectedStageForDefect.id) {
                                        return {
                                          ...stage,
                                          defects: stage.defects.map(d => 
                                            d.id === defect.id ? { ...d, severity: value } : d
                                          )
                                        };
                                      }
                                      return stage;
                                    })
                                  };
                                }
                                return tp;
                              });
                              setTechPlaces(updatedTechPlaces);
                              const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
                              setSelectedTechPlace(updatedTechPlace);
                              // Update the selected stage in local state
                              const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStageForDefect.id);
                              setSelectedStageForDefect(updatedStage);
                            }}
                            options={[
                              { label: 'Нет дефекта', value: 'none' },
                              { label: 'Низкий', value: 'low' },
                              { label: 'Средний', value: 'medium' },
                              { label: 'Высокий', value: 'high' },
                            ]}
                          />
                        </div>
                        
                        {defect.photos && defect.photos.length > 0 && (
                          <div>
                            <div style={{ marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Фотографии:</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {defect.photos.map((photo, idx) => (
                                <img 
                                  key={idx} 
                                  src={photo.url} 
                                  alt={`Фото ${idx + 1}`}
                                  style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #d9d9d9'
                                  }} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              selectedTechPlace.stages.map(stage => (
                <Card
                  key={stage.id}
                  hoverable
                  onClick={() => setSelectedStageForDefect(stage)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedStageForDefect?.id === stage.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{stage.name}</span>
                    <Tag color={stage.inspected ? 'green' : 'default'}>
                      {stage.inspected ? 'Осмотрен' : 'Не осмотрен'}
                    </Tag>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Modal>
      </div>
    );
  };

  // Экран реестра дефектов
  const DefectRegistryScreen = () => {
    // Реестр дефектов - показываем только зарегистрированные дефекты
    // После принятия осмотра мастером дефекты попадают в реестр
    const [registrySearchText, setRegistrySearchText] = useState('');
    const [registryFilterType, setRegistryFilterType] = useState(null);
    const [registryFilterSeverity, setRegistryFilterSeverity] = useState(null);
    const [registryFilterDateFrom, setRegistryFilterDateFrom] = useState(null);
    const [registryFilterDateTo, setRegistryFilterDateTo] = useState(null);

    // Фильтрация дефектов
    const filteredDefects = registeredDefects.filter(defect => {
      // Поиск по наименованию, объекту, тех.месту
      if (registrySearchText) {
        const searchLower = registrySearchText.toLowerCase();
        const matchesName = defect.name?.toLowerCase().includes(searchLower);
        const matchesObject = 'ЛЭП-12'.toLowerCase().includes(searchLower);
        const matchesTechPlace = defect.techPlaceName?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesObject && !matchesTechPlace) return false;
      }
      // Фильтр по типу тех.места
      if (registryFilterType && defect.techPlaceType !== registryFilterType) {
        return false;
      }
      // Фильтр по критичности
      if (registryFilterSeverity && defect.severity !== registryFilterSeverity) {
        return false;
      }
      // Фильтр по дате обнаружения
      if (registryFilterDateFrom || registryFilterDateTo) {
        const defectDate = new Date(defect.date);
        if (registryFilterDateFrom && defectDate < new Date(registryFilterDateFrom)) return false;
        if (registryFilterDateTo && defectDate > new Date(registryFilterDateTo)) return false;
      }
      return true;
    });

    // Уникальные типы тех.мест для фильтра
    const uniqueTechPlaceTypes = [...new Set(registeredDefects.map(d => d.techPlaceType).filter(Boolean))];

    // Таблица дефектов
    const columns = [
      {
        title: 'Наименование дефекта',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <a 
            onClick={() => {
              setSelectedDefect(record);
              setDefectModalVisible(true);
            }}
            style={{ fontWeight: 500 }}
          >
            {text}
          </a>
        )
      },
      {
        title: 'Объект',
        dataIndex: 'object',
        key: 'object',
        render: () => 'ЛЭП-12'
      },
      {
        title: 'Тех. место',
        dataIndex: 'techPlaceName',
        key: 'techPlaceName'
      },
      {
        title: 'Тип тех. места',
        dataIndex: 'techPlaceType',
        key: 'techPlaceType',
        render: (type) => <Tag color="blue">{type}</Tag>
      },
      {
        title: 'Критичность',
        dataIndex: 'severity',
        key: 'severity',
        render: (severity) => (
          <Tag color={severity === 'none' ? 'default' : severity === 'low' ? 'gold' : severity === 'medium' ? 'orange' : 'red'}>
            {severity === 'none' ? 'Нет дефекта' : severity === 'low' ? 'Низкий' : severity === 'medium' ? 'Средний' : 'Высокий'}
          </Tag>
        )
      },
      {
        title: 'Дата обнаружения',
        dataIndex: 'date',
        key: 'date'
      }
    ];

    return (
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setCurrentScreen('main')}
          style={{ marginBottom: '16px' }}
        >
          На главную
        </Button>
        
        <h1 style={{ marginBottom: '24px' }}>Реестр дефектов</h1>

        {/* Фильтры и поиск */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            placeholder="Поиск по наименованию, объекту, тех.месту..."
            value={registrySearchText}
            onChange={(e) => setRegistrySearchText(e.target.value)}
            style={{ width: '300px' }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="Тип тех.места"
            value={registryFilterType}
            onChange={setRegistryFilterType}
            style={{ width: '180px' }}
            allowClear
            options={uniqueTechPlaceTypes.map(type => ({ value: type, label: type }))}
          />
          <Select
            placeholder="Критичность"
            value={registryFilterSeverity}
            onChange={setRegistryFilterSeverity}
            style={{ width: '150px' }}
            allowClear
            options={[
              { value: 'high', label: 'Высокая' },
              { value: 'medium', label: 'Средняя' },
              { value: 'low', label: 'Низкая' }
            ]}
          />
          <Input
            type="date"
            placeholder="Дата с"
            value={registryFilterDateFrom}
            onChange={(e) => setRegistryFilterDateFrom(e.target.value)}
            style={{ width: '150px' }}
          />
          <span style={{ color: '#666' }}>—</span>
          <Input
            type="date"
            placeholder="Дата по"
            value={registryFilterDateTo}
            onChange={(e) => setRegistryFilterDateTo(e.target.value)}
            style={{ width: '150px' }}
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredDefects} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <style>{`
        .severity-segmented.severity-low .ant-segmented-item-selected {
          background-color: #fffbe6 !important;
          color: #d4b106 !important;
          font-weight: 600;
        }
        .severity-segmented.severity-medium .ant-segmented-item-selected {
          background-color: #fff7e6 !important;
          color: #d46b08 !important;
          font-weight: 600;
        }
        .severity-segmented.severity-high .ant-segmented-item-selected {
          background-color: #fff1f0 !important;
          color: #cf1322 !important;
          font-weight: 600;
        }
      `}</style>
      {currentScreen === 'main' && <MainScreen />}
      {currentScreen === 'techPlaces' && <TechPlacesScreen />}
      {currentScreen === 'stages' && <StagesScreen />}
      {currentScreen === 'defects' && <DefectsScreen />}
      {currentScreen === 'inspectionCheck' && <InspectionCheckScreen />}
      {currentScreen === 'masterDefects' && <MasterDefectsScreen />}
      {currentScreen === 'defectRegistry' && <DefectRegistryScreen />}
      <Modal
        title="Карточка дефекта"
        open={defectModalVisible}
        onCancel={() => {
          setDefectModalVisible(false);
          setSelectedDefect(null);
        }}
        footer={null}
        width={1000}
      >
        {selectedDefect && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {selectedDefect.name}
                </div>
                <div style={{ color: '#4a5568', fontSize: '15px' }}>
                  Объект: ЛЭП-12 | Техническое место: {selectedDefect.techPlaceName}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedDefect.status === 'repeat' && (
                  <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#fff', background: '#2b6cb0' }}>
                    Повторный
                  </div>
                )}
                <div style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#fff', 
                  background: selectedDefect.severity === 'high' ? '#e53e3e' : selectedDefect.severity === 'medium' ? '#dd6b20' : selectedDefect.severity === 'low' ? '#38a169' : '#718096'
                }}>
                  Критичность: {selectedDefect.severity === 'high' ? 'Высокая' : selectedDefect.severity === 'medium' ? 'Средняя' : selectedDefect.severity === 'low' ? 'Низкая' : 'Нет дефекта'}
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div>
              {/* <h3 style={{ marginBottom: '15px', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Информация о дефекте</h3> */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
                <div><span style={{ color: '#718096' }}>Дата первого обнаружения:</span> {selectedDefect.date}</div>
                <div><span style={{ color: '#718096' }}>Дата последней актуализации:</span> {selectedDefect.lastUpdate || selectedDefect.date}</div>
                <div><span style={{ color: '#718096' }}>Дата устранения:</span> {selectedDefect.fixDate || '—'}</div>
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <div style={{ marginBottom: '8px', fontWeight: '500' }}>Фотографии:</div>
              {selectedDefect.photos && selectedDefect.photos.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedDefect.photos.map((photo, idx) => (
                    <img 
                      key={idx} 
                      src={photo.url} 
                      alt={`Фото ${idx + 1}`}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  border: '1px dashed #d9d9d9'
                }}>
                  <div style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '8px' }}>📷</div>
                  <div style={{ color: '#718096', fontStyle: 'italic' }}>Нет фото</div>
                </div>
              )}
            </div>

            {/* Inspection Lists Section */}
            <div>
              <h3 style={{ marginBottom: '15px', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Листы осмотра</h3>
              <Table
                dataSource={[
                  {
                    key: '1',
                    number: selectedDefect.id + 500,
                    detectionDate: selectedDefect.date,
                    agreementDate: '25.02.2026',
                    approvedBy: 'Иванов И.А.',
                    severity: selectedDefect.severity
                  }
                ]}
                columns={[
                  { 
                    title: '№ Листа', 
                    dataIndex: 'number', 
                    key: 'number',
                    render: (text) => (
                      <a href="#" onClick={(e) => { e.preventDefault(); console.log('Navigate to sheet ' + text); }}>{text}</a>
                    )
                  },
                  { title: 'Дата обнаружения', dataIndex: 'detectionDate', key: 'detectionDate' },
                  { title: 'Дата согласования', dataIndex: 'agreementDate', key: 'agreementDate' },
                  { title: 'Согласовал', dataIndex: 'approvedBy', key: 'approvedBy' },
                  { 
                    title: 'Критичность', 
                    dataIndex: 'severity', 
                    key: 'severity',
                    render: (severity) => (
                      <span style={{ 
                        color: severity === 'high' ? '#e53e3e' : severity === 'medium' ? '#dd6b20' : severity === 'low' ? '#38a169' : '#718096',
                        fontWeight: severity !== 'none' ? 'bold' : 'normal'
                      }}>
                        {severity === 'high' ? 'Высокая' : severity === 'medium' ? 'Средняя' : severity === 'low' ? 'Низкая' : 'Нет дефекта'}
                      </span>
                    )
                  }
                ]}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InspectionApp;
