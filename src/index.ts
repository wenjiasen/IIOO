import { Engine } from './core/engine';
import { MongoDBStore } from './store/mongodb';

// 初始化一个engine
const engine = new Engine(new MongoDBStore());
// 开始engine
engine.start();
