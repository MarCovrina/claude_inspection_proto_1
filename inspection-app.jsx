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

  // Обработчик загрузки фото
  const handlePhotoUpload = (defectId, file) => {
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
                    return {
                      ...defect,
                      photos: [...defect.photos, { url: URL.createObjectURL(file), file }]
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
                      { label: 'Нет', value: 'none' },
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
                // Получаем все дефекты со всех тех.мест
                const allDefects = [];
                techPlaces.forEach(techPlace => {
                  techPlace.stages.forEach(stage => {
                    stage.defects.forEach(defect => {
                      const hasSeverity = defect.severity !== 'none';
                      const hasPhotos = defect.photos && defect.photos.length > 0;
                      const hasComment = defect.comment && defect.comment.trim() !== '';
                      
                      if (hasSeverity || hasPhotos || hasComment) {
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
                setCurrentScreen('techPlaces');
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
                          { label: 'Нет', value: 'none' },
                          { label: 'Низкий', value: 'low' },
                          { label: 'Средний', value: 'medium' },
                          { label: 'Высокий', value: 'high' },
                        ]}
                        size="small"
                      />
                    ) : (
                      <Tag color={currentSeverity === 'none' ? 'default' : currentSeverity === 'low' ? 'gold' : currentSeverity === 'medium' ? 'orange' : 'red'}>
                        {currentSeverity === 'none' ? 'Нет' : currentSeverity === 'low' ? 'Низкий' : currentSeverity === 'medium' ? 'Средний' : 'Высокий'}
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
      </div>
    );
  };

  // Экран реестра дефектов
  const DefectRegistryScreen = () => {
    // Реестр дефектов - показываем только зарегистрированные дефекты
    // После принятия осмотра мастером дефекты попадают в реестр
    const allDefects = registeredDefects;

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
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'new' ? 'blue' : status === 'repeat' ? 'orange' : status === 'fixed' ? 'green' : 'default'}>
            {status === 'new' ? 'Новый' : status === 'repeat' ? 'Повторный' : status === 'fixed' ? 'Устранен' : 'Не подтвержден'}
          </Tag>
        )
      },
      {
        title: 'Критичность',
        dataIndex: 'severity',
        key: 'severity',
        render: (severity) => (
          <Tag color={severity === 'none' ? 'default' : severity === 'low' ? 'gold' : severity === 'medium' ? 'orange' : 'red'}>
            {severity === 'none' ? 'Нет' : severity === 'low' ? 'Низкий' : severity === 'medium' ? 'Средний' : 'Высокий'}
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

        <Table 
          columns={columns} 
          dataSource={allDefects} 
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
        width={700}
      >
        {selectedDefect && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Название дефекта:</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedDefect.name}</div>
            </div>
            
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Объект:</div>
              <div>ЛЭП-12</div>
            </div>
            
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Техническое место:</div>
              <div>{selectedDefect.techPlaceName}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Статус:</div>
                <Tag color={selectedDefect.status === 'new' ? 'blue' : selectedDefect.status === 'repeat' ? 'orange' : selectedDefect.status === 'fixed' ? 'green' : 'default'}>
                  {selectedDefect.status === 'new' ? 'Новый' : selectedDefect.status === 'repeat' ? 'Повторный' : selectedDefect.status === 'fixed' ? 'Устранен' : 'Не подтвержден'}
                </Tag>
              </div>
              
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Критичность:</div>
                <Tag color={selectedDefect.severity === 'none' ? 'default' : selectedDefect.severity === 'low' ? 'gold' : selectedDefect.severity === 'medium' ? 'orange' : 'red'}>
                  {selectedDefect.severity === 'none' ? 'Нет' : selectedDefect.severity === 'low' ? 'Низкий' : selectedDefect.severity === 'medium' ? 'Средний' : 'Высокий'}
                </Tag>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Дата первого обнаружения:</div>
                <div>{selectedDefect.date}</div>
              </div>
              
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Дата последней актуализации:</div>
                <div>{selectedDefect.lastUpdate || selectedDefect.date}</div>
              </div>
              
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px', color: '#666' }}>Дата устранения:</div>
                <div>{selectedDefect.fixDate || '-'}</div>
              </div>
            </div>
            
            {selectedDefect.photos && selectedDefect.photos.length > 0 && (
              <div>
                <div style={{ fontWeight: '500', marginBottom: '8px', color: '#666' }}>Фотографии:</div>
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
              </div>
            )}
            
            <div>
              <div style={{ fontWeight: '500', marginBottom: '8px', color: '#666' }}>Ссылки на листы осмотра:</div>
              <div style={{ color: '#1890ff', cursor: 'pointer' }}>
                Лист осмотра от {selectedDefect.date}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InspectionApp;
